import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


export abstract class AbstractModel {

    public static parseNumber(value: any): number {
        if (typeof value === 'number') {
            return value;
        }

        return parseInt(String(value).split('-')[0].trim(), 10);
    }


    public abstract get controllerUrl(): string;
    public abstract id: number;
    public total: number = 0;


    constructor() {}


    public query(params: IQuery): Promise<AbstractModel[]> {
        if (params.orders.length === 0) {
            params.orders = [['id', 'ASC']];
        }

        return new Promise<AbstractModel[]>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                    `/${this.controllerUrl}/select`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify(params),
                { 'Content-Type': 'application/json' },
            ).then((data: any) => {
                console.log(data);
                const models: AbstractModel[] = [];

                data.entries.forEach((item) => {
                    models.push((<any> this).from(item));
                    models[models.length - 1].total = data.total;
                });

                resolve(models);
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public create(): Promise<AbstractModel> {
        return new Promise<AbstractModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                    `/${this.controllerUrl}/create`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve(<AbstractModel> (<IModel> this).from(data));
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public read(id?: number): Promise<AbstractModel> {
        return new Promise<AbstractModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                    `/${this.controllerUrl}/${id || this.id}`,
                JSWorks.HTTPMethod.GET
            ).then((data) => {
                (<IModel> this).apply(data);
                resolve(this);
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public update(): Promise<AbstractModel> {
        return new Promise<AbstractModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                    `/${this.controllerUrl}/update`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                (<IModel> this).apply(data);
                (<IModel> this).setDirty(false);

                resolve(this);
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public ['delete'](): Promise<AbstractModel> {
        return new Promise<AbstractModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                    `/${this.controllerUrl}/delete`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ id: this.id }),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve(this);
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public from(data?: object): AbstractModel { return undefined; };

}
