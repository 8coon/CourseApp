import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractAdminPageController} from "../AbstractAdminPageController";
import {IQuery} from "../../../helpers/QueryBuilder";
import {UserModel} from "../../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class AdminUsersController extends AbstractAdminPageController {


    public query(query: IQuery): Promise<any> {
        return (<UserModel> JSWorks.applicationContext.modelHolder.getModel('UserModel')).query(query);
    }


    public setup() {
        this.table.title = 'Пользователи';

        (<any> this.table.columns).setValues([
            {
                name: 'id',
                title: 'ID',
                width: 0.1,
                canOrder: true,
                isTitle: true,
            },
            {
                name: 'first_name',
                title: 'ИМЯ',
                canOrder: true,
                canEdit: true,
                canFilter: true,
            },
            {
                name: 'last_name',
                title: 'ФАМИЛИЯ',
                canOrder: true,
                canEdit: true,
                canFilter: true,
            },
            {
                name: 'email',
                title: 'EMAIL',
                canOrder: true,
                canEdit: true,
                canFilter: true,
            },
            {
                name: 'role_text',
                title: 'ГРУППА',
                canOrder: true,
                canEdit: true,
                canFilter: true,
                type: 'select',
                selectList: [
                    'Студенты',
                    'Преподаватели',
                    'Администраторы',
                ],
            },
        ]);
    }

}
