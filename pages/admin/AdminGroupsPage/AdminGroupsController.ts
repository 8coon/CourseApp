import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractAdminPageController} from "../AbstractAdminPageController";
import {IQuery} from "../../../helpers/QueryBuilder";
import {UserModel} from "../../../models/UserModel";
import {IModel} from "jsworks/dist/dts/Model/IModel";
import {CourseModel} from "../../../models/CourseModel";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {SimpleVirtualDOM} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOM";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class AdminGroupsController extends AbstractAdminPageController {

    public modelName: string = 'GroupModel';
    public addFormName: string = 'GroupAddFormView';


    public onFormOpen(form: FormForElement): Promise<any> {
        return (<IModel> JSWorks.applicationContext.modelHolder.getModel('CourseModel'))
            .query({limit: 1000, offset: 0, orders: [], filters: []})
            .then((courses: CourseModel[]) => {
                const virtualDOM: SimpleVirtualDOM = JSWorks.applicationContext.serviceHolder
                        .getServiceByName('SimpleVirtualDOM');
                const select: SimpleVirtualDOMElement = form.querySelector('select');
                select.removeChildren();

                const option = virtualDOM.createElement('OPTION');
                option.appendChild(virtualDOM.createTextElement('Выберите курс:'));
                option.setAttribute('selected', 'selected');

                select.appendChild(option);

                courses.forEach((course: CourseModel) => {
                    const option = virtualDOM.createElement('OPTION');
                    option.appendChild(virtualDOM.createTextElement(`${course.id} - ${course.name}`));
                    select.appendChild(option);
                });
            });
    }


    public setup() {
        this.table.title = 'Группы';

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
            },
        ]);
    }

}
