import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {AbstractModel} from "./AbstractModel";
import {IQuery} from "../helpers/QueryBuilder";
import {SubjectModel} from "./SubjectModel";
import {GroupModel} from "./GroupModel";


declare const JSWorks: JSWorksLib;


export interface MarkModelFields {
    id: number;
    min: number;
    max: number;
    name: string;
    subject_id: number;
    subject_name: string;
}


@JSWorks.Model
export class MarkModel extends AbstractModel implements MarkModelFields {

    public subjectFilterId: number = 0;

    @JSWorks.ModelField
    @JSWorks.ModelPrimaryKey
    public id: number;

    @JSWorks.ModelField
    public min: number;

    @JSWorks.ModelField
    public max: number;

    @JSWorks.ModelField
    public name: string;

    @JSWorks.ModelField
    public subject_id: number;

    @JSWorks.ModelField
    public subject_name: string;


    public controllerUrl: string = 'mark';


    constructor() {
        super();
    }


    @JSWorks.ModelQueryMethod
    public query(params: IQuery): Promise<AbstractModel[]> {
        params.orders = [['min', 'ASC']];
        params.filters = [['subject_id', `${this.subjectFilterId}`]];
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
