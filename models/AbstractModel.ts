import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


export abstract class AbstractModel {


    public abstract get controllerUrl(): string;
    public abstract id: number;
    public total: number = 0;


    constructor() {}


    public query(params: IQuery): Promise<AbstractModel[]> {
        return new Promise<AbstractModel[]>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + `/${this.controllerUrl}/select`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify(params),
                { 'Content-Type': 'application/json' },
            ).then((data: any) => {
                const models: AbstractModel[] = [];

                data.entries.forEach((item) => {
                    models.push((<any> this).from(item));
                    models[models.length - 1].total = data.total;
                });

                resolve(models);
            });
        });
    }


    public create(): Promise<AbstractModel> {
        return new Promise<AbstractModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + `/${this.controllerUrl}/create`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve(<AbstractModel> (<IModel> this).from(data));
            });
        });
    }


    public read(id?: number): Promise<AbstractModel> {
        return new Promise<AbstractModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + `/${this.controllerUrl}/${id || this.id}`,
                JSWorks.HTTPMethod.GET
            ).then((data) => {
                (<IModel> this).apply(data);
                resolve(this);
            });
        });
    }


    public update(): Promise<AbstractModel> {
        return new Promise<AbstractModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + `/${this.controllerUrl}/update`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                (<IModel> this).apply(data);
                (<IModel> this).setDirty(false);

                resolve(this);
            });
        });
    }


    public ['delete'](): Promise<AbstractModel> {
        return new Promise<AbstractModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + `/${this.controllerUrl}/delete`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ id: this.id }),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve(this);
            });
        });
    }

}
