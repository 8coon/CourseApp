import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {AbstractModel} from "./AbstractModel";
import {IQuery} from "../helpers/QueryBuilder";
import {SubjectModel} from "./SubjectModel";
import {GroupModel} from "./GroupModel";


declare const JSWorks: JSWorksLib;


export interface CourseModelFields {
    id: number;
    name: string;
}


@JSWorks.Model
export class CourseModel extends AbstractModel implements CourseModelFields {

    @JSWorks.ModelField
    @JSWorks.ModelPrimaryKey
    public id: number;

    @JSWorks.ModelField
    public name: string;

    public controllerUrl: string = 'course';


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


    public groupsAndSubjects(courseId: number): Promise<{groups: GroupModel[], subjects: SubjectModel[]}> {
        return new Promise<{groups: GroupModel[], subjects: SubjectModel[]}>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                        `/course/${courseId}/subjectsAndGroups`,
                JSWorks.HTTPMethod.GET,
                JSON.stringify({ course_id: courseId}),
            ).then((data) => {
                if (data['error']) {
                    reject(data['error']);
                    return;
                }

                const groupModel: IModel = JSWorks.applicationContext.modelHolder.getModel('GroupModel');
                const subjectModel: IModel = JSWorks.applicationContext.modelHolder.getModel('SubjectModel');

                resolve(
                    {
                        groups: data['groups'].map(i => groupModel.from(i)),
                        subjects: data['subjects'].map(i => subjectModel.from(i)),
                    }
                );
            }).catch((err) => {
                reject(err);
            });
        });
    }

}
