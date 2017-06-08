import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {AbstractAdminPageController} from "../AbstractAdminPageController";
import {IQuery} from "../../../helpers/QueryBuilder";
import {UserModel} from "../../../models/UserModel";
import {IModel} from "jsworks/dist/dts/Model/IModel";
import {CourseModel} from "../../../models/CourseModel";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {SimpleVirtualDOM} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOM";
import {TableComponent} from "../../../components/TableComponent/TableComponent";
import {SubjectModel} from "../../../models/SubjectModel";
import {View} from "jsworks/dist/dts/View/View";
import {WindowComponent} from "../../../components/WindowComponent/WindowComponent";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class AdminSubjectsController extends AbstractAdminPageController {

    public modelName: string = 'SubjectModel';
    public addFormName: string = 'SubjectAddFormView';
    public professorsFormName: string = 'SubjectProfessorsFormView';


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


    public onProfessorsClick(table: TableComponent, data: object): void {
        const virtualDOM: SimpleVirtualDOM = JSWorks.applicationContext.serviceHolder
                .getServiceByName('SimpleVirtualDOM');
        const userModel: UserModel = <UserModel> JSWorks.applicationContext.modelHolder
                .getModel('UserModel');
        const subjectModel: SubjectModel = <SubjectModel> JSWorks.applicationContext.modelHolder
                .getModel('SubjectModel');
        const id: number = data['id'];
        let select: SimpleVirtualDOMElement;

        this.openWindow(this.professorsFormName, (form: FormForElement, windowView: View): Promise<any> => {
            select = windowView.DOMRoot.querySelector('.select-professor');
            select.removeChildren();

            return userModel.query(
                { offset: 0, limit: 9000, orders: [['id', 'ASC']], filters: [['role', '2']]}
            ).then((allProfessors: UserModel[]) => {
                allProfessors.forEach((professor: UserModel) => {
                    const option = virtualDOM.createElement('OPTION');
                    option.appendChild(virtualDOM.createTextElement(
                            `${professor.id} - ${professor.first_name} ${professor.last_name}`));
                    select.appendChild(option);
                });
            }).then(() => {
                return subjectModel.professors(id).then((professors: UserModel[]) => {
                    professors.forEach((professor: UserModel) => {
                        const profStamp: string =
                                `${professor.id} - ${professor.first_name} ${professor.last_name}`;

                        select.querySelectorAll('option').forEach((option: SimpleVirtualDOMElement) => {
                            if (option.innerHTML === profStamp) {
                                option.setAttribute('selected', 'selected');
                            }
                        });
                    });
                });
            }).then(() => {
                const windows: WindowComponent = JSWorks.applicationContext.currentPage['view']
                        .DOMRoot.querySelector('#modal-root').component;
                const applyButton: SimpleVirtualDOMElement =
                        windowView.DOMRoot.querySelector('.form-apply');

                if (applyButton['_subjectsPatched']) {
                    return;
                }

                applyButton.addEventListener('click', () => {
                    const options = (<HTMLSelectElement> select.rendered).options;
                    const selected: string[] = [];

                    for (let i = 0; i < options.length; i++) {
                        if (options[i].selected) {
                            selected.push(options[i].text);
                        }
                    }

                    applyButton.setAttribute('disabled', 'disabled');

                    subjectModel.setProfessors(id, selected).then(() => {
                        applyButton.removeAttribute('disabled');
                        windows.closeLastWindow();
                    }).catch((err) => {
                        applyButton.removeAttribute('disabled');
                        windows.closeLastWindow();
                    });
                });

                applyButton['_subjectsPatched'] = true;
            });
        });
    }


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
            },
            {
                title: 'ПРЕПОДАВАТЕЛИ',
                type: 'button',
                buttonText: 'Назначить',
                width: 0.15,

                onButtonClick: (table: TableComponent, data: object) => {
                    this.onProfessorsClick(table, data);
                }
            }
        ]);
    }

}
