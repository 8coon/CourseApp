import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractAdminPageController} from "../AbstractAdminPageController";
import {IQuery} from "../../../helpers/QueryBuilder";
import {UserModel} from "../../../models/UserModel";
import {IModel} from "jsworks/dist/dts/Model/IModel";
import {CourseModel} from "../../../models/CourseModel";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {SimpleVirtualDOM} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOM";
import {SubjectModel} from "../../../models/SubjectModel";
import {GroupModel} from "../../../models/GroupModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class AdminClassesController extends AbstractAdminPageController {

    public modelName: string = 'ClassModel';
    public addFormName: string = 'ClassAddFormView';


    public onFormOpen(form: FormForElement): Promise<any> {
        const virtualDOM: SimpleVirtualDOM = JSWorks.applicationContext.serviceHolder
            .getServiceByName('SimpleVirtualDOM');
        const select: SimpleVirtualDOMElement = form.querySelector('.select-course');

        if (!select['_adminPatched']) {
            select.addEventListener('change', () => {
                const value: string = (<any> select.rendered).value;

                if (!value.includes('-')) {
                    return;
                }

                const courseId: number = parseInt(String(value).split('-')[0].trim(), 10);

                (<CourseModel> JSWorks.applicationContext.modelHolder.getModel('CourseModel'))
                    .groupsAndSubjects(courseId)
                    .then((groupsAndSubjects) => {
                        const selectGroup: SimpleVirtualDOMElement = form.querySelector('.select-group');
                        selectGroup.removeChildren();

                        let option = virtualDOM.createElement('OPTION');
                        option.appendChild(virtualDOM.createTextElement('Выберите группы:'));
                        option.setAttribute('selected', 'selected');

                        selectGroup.appendChild(option);

                        groupsAndSubjects.groups.forEach((group: GroupModel) => {
                            const option = virtualDOM.createElement('OPTION');
                            option.appendChild(virtualDOM.createTextElement(`${group.id} - ${group.name}`));
                            selectGroup.appendChild(option);
                        });


                        const selectSubject: SimpleVirtualDOMElement = form.querySelector('.select-subject');
                        selectSubject.removeChildren();

                        option = virtualDOM.createElement('OPTION');
                        option.appendChild(virtualDOM.createTextElement('Выберите предмет:'));
                        option.setAttribute('selected', 'selected');

                        selectSubject.appendChild(option);

                        groupsAndSubjects.subjects.forEach((subject: SubjectModel) => {
                            const option = virtualDOM.createElement('OPTION');
                            option.appendChild(virtualDOM.createTextElement(`${subject.id} - ${subject.name}`));
                            selectSubject.appendChild(option);
                        });
                    });
            });
        }

        return (<CourseModel> JSWorks.applicationContext.modelHolder.getModel('CourseModel'))
            .query({ limit: 1000, offset: 0, orders: [["name", "ASC"]], filters: [] })
            .then((courses: CourseModel[]) => {
                const selectCourse: SimpleVirtualDOMElement = form.querySelector('.select-course');
                selectCourse.removeChildren();

                let option = virtualDOM.createElement('OPTION');
                option.appendChild(virtualDOM.createTextElement('Выберите курс:'));
                option.setAttribute('selected', 'selected');

                selectCourse.appendChild(option);

                courses.forEach((course: CourseModel) => {
                    const option = virtualDOM.createElement('OPTION');
                    option.appendChild(virtualDOM.createTextElement(`${course.id} - ${course.name}`));
                    selectCourse.appendChild(option);
                });
            });
    }


    public setup() {
        this.table.title = 'Занятия';

        (<any> this.table.columns).setValues([
            {
                name: 'id',
                title: 'ID',
                width: 0.1,
                canOrder: true,
            },
            {
                name: '_date',
                title: 'ДАТА',
            },
            {
                name: '_times',
                title: 'ВРЕМЯ',
            },
            {
                name: 'subject_name',
                title: 'ПРЕДМЕТ',
            },
            {
                name: 'group_name',
                title: 'КУРС',
            },
        ]);
    }

}
