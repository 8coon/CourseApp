import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {IModel} from "jsworks/dist/dts/Model/IModel"
import {AbstractModel} from "./AbstractModel";
import {IQuery} from "../helpers/QueryBuilder";
import {UserModel} from "./UserModel";


declare const JSWorks: JSWorksLib;


export interface ClassModelFields {
    id: number;
    begin_time: string;
    end_time: string;
    subject_id: number;
    subject_name: string;
    group_ids: number[];
    group_name: string;
    professor_id: number;
    professor_first_name: string;
    professor_last_name: string;
    topic: string;
    location: string;
}


export interface JournalClassMark {
    mark: number;
    comment?: string;
}

export interface JournalRawClass {
    mark?: JournalClassMark;
    class_id: number;
    class_begin_date: string;
}

export interface JournalRawStudent {
    classes: JournalRawClass[];
    student_id: number;
    student_first_name: number;
    student_last_name: number;
}

export interface JournalClass {
    mark?: JournalClassMark;
    class_id: number;
    class_begin_date: Date;
}

export interface JournalStudent {
    classes: JournalClass[];
    student_id: number;
    student_first_name: number;
    student_last_name: number;
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
    public course_id: number;

    @JSWorks.ModelField
    public course_name: string;


    @JSWorks.ModelField
    public group_ids: number[];

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


    public date: Date;


    public set _course_id(value) {
        this.course_id = AbstractModel.parseNumber(value);
    }

    public set _subject_id(value) {
        this.subject_id = AbstractModel.parseNumber(value);
    }

    public set _professor_id(value) {
        this.professor_id = AbstractModel.parseNumber(value);
    }

    public set _group_ids(value: any[]) {
        this.group_ids = value.map(value => AbstractModel.parseNumber(value));
    }

    public set _date(value) {
        this.date = new Date(value);
    }


    private setTime(fieldName: string, value): void {
        value = value.split(':');

        const date: Date = new Date(this.date.valueOf());
        date.setHours(parseInt(value[0], 10), parseInt(value[1], 10), 0, 0);

        this[fieldName] = date.toISOString().replace('.000Z', '');
    }

    public set _begin_time(value) {
        this.setTime('begin_time', value);
    }

    public set _end_time(value) {
        this.setTime('end_time', value);
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
        const data: object = (<any> this).gist();
        data['amount'] = this['amount'] || 1;
        data['week_offset'] = this['week_offset'] || 1;
        data['prof_id'] = data['professor_id'];
        delete data['professor_id'];

        return new Promise<ClassModel>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                `/class/createBatch`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify(data),
                { 'Content-Type': 'application/json' },
            ).then((data) => {
                resolve();
            }).catch((err) => {
                reject(err);
            })
        });
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


    public journal(groupId: number, subjectId: number): Promise<JournalStudent[]> {
        return new Promise<JournalStudent[]>((resolve, reject) => {
            (<IModel> this).jsonParser.parseURLAsync(JSWorks.config['backendURL'] +
                `/journal/show`,
                JSWorks.HTTPMethod.POST,
                JSON.stringify({ group_id: groupId, subject_id: subjectId }),
                { 'Content-Type': 'application/json' },
            ).then((students: JournalRawStudent[]) => {
                console.log(`group: ${groupId}, subject: ${subjectId}`);
                console.log(students);

                resolve(students.map((student: JournalRawStudent) => {
                    student.classes = <any> student.classes.map((rawClass: JournalRawClass) => {
                        (<any> rawClass).class_begin_date = new Date(rawClass.class_begin_date);
                        return <any> rawClass;
                    });

                    return <any> student;
                }));
            }).catch((err) => {
                reject(err);
            })
        });
    }

}
