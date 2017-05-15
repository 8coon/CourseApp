import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"


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
class UserModel implements UserModelFields, IModel {

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


    /* @JSWorks.ModelQueryMethod
    public query(params?: object): Promise<UserModel[]> {
        params = params || {};
        const sort = String(params['sort'] || 'ASC');

        return new Promise<TestModel[]>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(`/persons/all?sort=${sort}`, JSWorks.HTTPMethod.POST).then((data) => {
                const models: TestModel[] = [];

                data.forEach((item: TestModelFields) => {
                    models.push(this.from(item));
                });

                resolve(models);
            });
        });
    } */


    @JSWorks.ModelCreateMethod
    public create(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + '/user/create',
                JSWorks.HTTPMethod.POST,
                JSON.stringify((<IModel> this).gist())
            ).then((data) => {
                resolve(<UserModel> (<IModel> this).from(data));
            });
        });
    }


    @JSWorks.ModelReadMethod
    public read(id?: number): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks['_url'] + `/user/${id || this.id}`,
                JSWorks.HTTPMethod.POST
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
                JSON.stringify({ id: this.id })
            ).then((data) => {
                resolve(this);
            });
        });
    }

}
