import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {AbstractModel} from "./AbstractModel";
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


export interface RequestModelFields {
    id: number;
    course_id: number;
    course_name: string;
    student_first: string;
    student_last: string;
}


@JSWorks.Model
export class RequestModel extends AbstractModel implements RequestModelFields {

    @JSWorks.ModelField
    @JSWorks.ModelPrimaryKey
    public id: number;

    @JSWorks.ModelField
    public course_id: number;

    @JSWorks.ModelField
    public course_name: string;

    @JSWorks.ModelField
    public student_first: string;

    @JSWorks.ModelField
    public student_last: string;

    public controllerUrl: string = 'request';


    constructor() {
        super();
    }


    get _student_name(): string {
        return `${this.student_last} ${this.student_first}`;
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


    public approve(groupId: number, id?: number) {
        return new Promise<any>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                `/request/accept`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ request_id: id || this.id, group_id: groupId }),
                { 'Content-Type': 'application/json' },
            ).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

}
