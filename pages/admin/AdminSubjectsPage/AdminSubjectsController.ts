import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractAdminPageController} from "../AbstractAdminPageController";
import {IQuery} from "../../../helpers/QueryBuilder";
import {UserModel} from "../../../models/UserModel";
import {IModel} from "jsworks/dist/dts/Model/IModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class AdminSubjectsController extends AbstractAdminPageController {

    public modelName: string = 'SubjectModel';
    public addFormName: string = 'SubjectAddFormView';


    public setup() {
        this.table.title = 'Предметы';

        (<any> this.table.columns).setValues([
            {
                name: 'id',
                title: 'ID',
                width: 0.1,
                canOrder: true,
            },
            {
                name: 'name',
                title: 'НАЗВАНИЕ',
                canOrder: true,
                canEdit: true,
                canFilter: true,
            },
            {
                name: 'course_name',
                title: 'НАЗВАНИЕ КУРСА',
                canOrder: true,
                canFilter: true,
            },
        ]);
    }

}
