import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


interface UserModelFields {
    id: number;
    role: number;
    email: string,
    first_name: string,
    last_name: string,
    about: string,
    password?: string;
}


@JSWorks.Model
export class UserModel implements UserModelFields, IModel {

    @JSWorks.ModelField
    @JSWorks.ModelPrimaryKey
    public id: number;

    @JSWorks.ModelField
    public role: number;

    @JSWorks.ModelField
    public email: string;

    @JSWorks.ModelField
    public first_name: string;

    @JSWorks.ModelField
    public last_name: string;

    @JSWorks.ModelField
    public about: string;

    @JSWorks.ModelField
    public password: string;


    public get role_text(): string {
        switch (this.role) {
            case 0: return 'Администраторы';
            case 1: return 'Студенты';
            case 2: return 'Преподаватели';
        }
    }

    public set role_text(value: string) {
        switch (value) {
            case 'Администраторы': this.role = 0; return;
            case 'Студенты': this.role = 1; return;
            case 'Преподаватели': this.role = 2; return;
        }
    }


    @JSWorks.ModelQueryMethod
    public query(params: IQuery): Promise<UserModel[]> {
        return new Promise<UserModel[]>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + '/user/select',
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data: UserModelFields[]) => {
                const models: UserModel[] = [];

                data.forEach((item: UserModelFields) => {
                    models.push((<any> this).from(item));
                });

                resolve(models);
            });
        });
    }


    @JSWorks.ModelCreateMethod
    public create(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + '/user/create',
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve(<UserModel> (<IModel> this).from(data));
            });
        });
    }


    @JSWorks.ModelReadMethod
    public read(id?: number): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + `/user/${id || this.id}`,
                JSWorks.HTTPMethod.GET
            ).then((data) => {
                (<IModel> this).apply(data);
                resolve(this);
            });
        });
    }


    /* @JSWorks.ModelUpdateMethod
    public update(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            this.jsonParser.parseURLAsync(JSWorks['_url'] + '/persons/update', JSWorks.HTTPMethod.POST,
                JSON.stringify(this.gist())).then((data) => {
                this.apply(data);
                this.setDirty(false);

                resolve(this);
            });
        });
    } */


    @JSWorks.ModelDeleteMethod
    public ['delete'](): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + '/user/delete',
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ id: this.id }),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve(this);
            });
        });
    }


    public current(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + '/session/current',
                JSWorks.HTTPMethod.GET,
            ).then((data) => {
                if (!data['status']) {
                    (<IModel> this).apply(data);
                }

                resolve(this);
            }).catch((err) => {
                resolve(this);
            });
        });
    }


    public login(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + '/session/login',
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ email: this.email, password: this.password }),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                if (data['error']) {
                    reject(data['error']);
                    return;
                }

                (<IModel> this).apply(data);
                resolve(this);
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public logout(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + '/session/logout',
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist()),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve();
            }).catch((err) => {
                resolve();
            });
        });
    }


    public loggedIn(): boolean {
        return this.id !== undefined;
    }

}