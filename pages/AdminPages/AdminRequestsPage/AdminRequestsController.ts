import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractAdminPageController} from "../AbstractAdminPageController";
import {IQuery} from "../../../helpers/QueryBuilder";
import {UserModel} from "../../../models/UserModel";
import {IModel} from "jsworks/dist/dts/Model/IModel";
import {TableComponent} from "../../../components/TableComponent/TableComponent";
import {RequestModel} from "../../../models/RequestModel";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {GroupModel} from "../../../models/GroupModel";
import {CourseModel} from "../../../models/CourseModel";
import {SubjectModel} from "../../../models/SubjectModel";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {SimpleVirtualDOM} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOM";
import {AbstractModel} from "../../../models/AbstractModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class AdminRequestsController extends AbstractAdminPageController {

    public modelName: string = 'RequestModel';
    public addFormName: string = 'RequestAddToGroupView';

    public requestModel: RequestModel;
    public courseModel: CourseModel;


    public onFormOpen(form: FormForElement, courseId?: number): Promise<any> {
        form.onSubmit = (): boolean => {
            const select: SimpleVirtualDOMElement = form.querySelector('.select-group');
            const groupId: number = AbstractModel.parseNumber((<HTMLSelectElement> select.rendered).value);

            this.requestModel.approve(groupId, courseId).then(() => {
                this.table.controller.refresh();
            });

            return true;
        };

        this.requestModel = <RequestModel> JSWorks.applicationContext.modelHolder
                .getModel('RequestModel');
        this.courseModel = <CourseModel> JSWorks.applicationContext.modelHolder
                .getModel('CourseModel');

        return this.courseModel.groupsAndSubjects(courseId)
                .then((data: {groups: GroupModel[], subjects: SubjectModel[]}) => {
            const virtualDOM: SimpleVirtualDOM = JSWorks.applicationContext.serviceHolder
                    .getServiceByName('SimpleVirtualDOM');
            const select: SimpleVirtualDOMElement = form.querySelector('.select-group');
            select.removeChildren();

            data.groups.forEach((group: GroupModel) => {
                const option = virtualDOM.createElement('OPTION');
                option.appendChild(virtualDOM.createTextElement(`${group.id} - ${group.name}`));
                select.appendChild(option);
            });
        });
    }


    public setup() {
        this.table.title = 'Заявки на курсы';

        (<any> this.table.columns).setValues([
            {
                name: 'id',
                title: 'ID',
                width: 0.05,
            },
            {
                name: 'course_name',
                title: 'КУРС',
                width: 0.5,
            },
            {
                name: '_student_name',
                title: 'ЗАЯВИТЕЛЬ',
            },
            {
                name: '',
                title: '',
                type: 'button',
                buttonText: 'Принять',

                onButtonClick: (table: TableComponent, data: RequestModel) => {
                    this.openWindow(this.addFormName,
                            (form: FormForElement) => this.onFormOpen(form, data.course_id));
                }
            }
        ]);
    }

}
