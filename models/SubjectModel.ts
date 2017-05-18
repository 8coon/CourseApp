import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {AbstractModel} from "./AbstractModel";
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


export interface SubjectModelFields {
    id: number;
    name: string;
    course_id: number;
    course_name: string;
}


@JSWorks.Model
export class SubjectModel extends AbstractModel implements SubjectModelFields {

    @JSWorks.ModelField
    @JSWorks.ModelPrimaryKey
    public id: number;

    @JSWorks.ModelField
    public name: string;

    @JSWorks.ModelField
    public course_id: number;

    public set _course_id(value) {
        console.log(value);
        if (typeof value === 'number') {
            this.course_id = value;
            return;
        }

        this.course_id = parseInt(String(value).split('-')[0].trim(), 10);
    }

    @JSWorks.ModelField
    public course_name: string;

    public controllerUrl: string = 'subject';


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

}
