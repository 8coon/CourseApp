import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {AbstractModel} from "./AbstractModel";
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


export interface UserModelFields {
    id: number;
    role: number;
    email: string,
    first_name: string,
    last_name: string,
    about: string,
    password?: string;
}

export interface StudentAvailableCourse {
    id: number;
    name: string;
}

export interface ProfessorSubject {
    id: number;
    name: string;
}


@JSWorks.Model
export class UserModel extends AbstractModel implements UserModelFields, IModel {

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

    public set about(value: string) {}

    @JSWorks.ModelField
    public get about(): string { return ''; };

    @JSWorks.ModelField
    public password: string;

    public readonly controllerUrl: string = 'user';


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


    public current(): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] + '/session/current',
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
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] + '/session/login',
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
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] + '/session/logout',
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

    // public getInfo(): Promise<any> {
    //     if (!this.id) {
    //         return reject();
    //     }
    //     return new Promise<any>((res, rej) => {
    //
    //     })
    // }

    constructor() {
        super();
    }


    @JSWorks.ModelQueryMethod
    public query(params: IQuery): Promise<AbstractModel[]> {
        return super.query(params);
    }

    @JSWorks.ModelCreateMethod
    public create(): Promise<AbstractModel> {
        return super.create();
    }

    @JSWorks.ModelReadMethod
    public read(id?: number): Promise<AbstractModel> {
        return super.read(id);
    }

    @JSWorks.ModelDeleteMethod
    public ['delete'](): Promise<AbstractModel> {
        return super.delete();
    }

    @JSWorks.ModelUpdateMethod
    public update(): Promise<AbstractModel> {
        return super.update();
    }


    public availableCourses(): Promise<StudentAvailableCourse[]> {
        return new Promise<StudentAvailableCourse[]>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                    `/student/avaliableCourses`,
                JSWorks.HTTPMethod.GET,
            ).then((data: StudentAvailableCourse[]) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public requestCourse(courseId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                `/student/createRequest`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ id: courseId }),
                { 'Content-Type': 'application/json' },
            ).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }


    public professorSubjects(id?: number): Promise<ProfessorSubject[]> {
        return new Promise<ProfessorSubject[]>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                `/professor/${id || this.id}/subjects`,
                JSWorks.HTTPMethod.GET,
            ).then((subjects: ProfessorSubject[]) => {
                resolve(subjects);
            }).catch((err) => {
                reject(err);
            });
        });
    }

}
