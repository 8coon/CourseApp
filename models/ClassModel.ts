import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {AbstractModel} from "./AbstractModel";
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


export interface ClassModelFields {
    id: number;
    begin_time: string;
    end_time: string;
    subject_id: number;
    subject_name: string;
    group_id: number;
    group_name: string;
    professor_id: number;
    professor_first_name: string;
    professor_last_name: string;
    topic: string;
    location: string;
}


@JSWorks.Model
export class ClassModel extends AbstractModel implements ClassModelFields {

    @JSWorks.ModelField
    @JSWorks.ModelPrimaryKey
    public id: number;

    @JSWorks.ModelField
    public begin_time: string;

    @JSWorks.ModelField
    public end_time: string;

    @JSWorks.ModelField
    public subject_id: number;

    @JSWorks.ModelField
    public subject_name: string;

    @JSWorks.ModelField
    public group_id: number;

    @JSWorks.ModelField
    public group_name: string;

    @JSWorks.ModelField
    public professor_id: number;

    @JSWorks.ModelField
    public professor_first_name: string;

    @JSWorks.ModelField
    public professor_last_name: string;

    @JSWorks.ModelField
    public topic: string;

    @JSWorks.ModelField
    public location: string;

    public controllerUrl: string = 'class';


    public set _subject_id(value) {
        if (typeof value === 'number') {
            this.subject_id = value;
            return;
        }

        this.subject_id = parseInt(String(value).split('-')[0].trim(), 10);
    }


    public set _group_id(value) {
        if (typeof value === 'number') {
            this.subject_id = value;
            return;
        }

        this.group_id = parseInt(String(value).split('-')[0].trim(), 10);
    }


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
