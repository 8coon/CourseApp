import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {AbstractModel} from "./AbstractModel";
import {IQuery} from "../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


export interface GroupModelFields {
    id: number;
    course_id: number;
    name: string;
}


@JSWorks.Model
export class GroupModel extends AbstractModel implements GroupModelFields {

    @JSWorks.ModelField
    @JSWorks.ModelPrimaryKey
    public id: number;

    @JSWorks.ModelField
    public course_id: number;

    @JSWorks.ModelField
    public name: string;

    public controllerUrl: string = 'group';


    public set _course_id(value) {
        if (typeof value === 'number') {
            this.course_id = value;
            return;
        }

        this.course_id = parseInt(String(value).split('-')[0].trim(), 10);
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
