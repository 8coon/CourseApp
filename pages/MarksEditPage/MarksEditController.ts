import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel, ProfessorSubject} from "../../models/UserModel";
import {MarksEditPage} from "./MarksEditPage";
import {AbstractAuthorizingController} from "../AbstractAuthorizingController";
import {TableComponent} from "../../components/TableComponent/TableComponent";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {ClassModel, JournalStudent, JournalClass, JournalEntry, JournalClassMark} from "../../models/ClassModel";
import {ITableColumn} from "../../components/TableComponent/ITable";
import {WindowComponent} from "../../components/WindowComponent/WindowComponent";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {AbstractAdminPageController} from "../AdminPages/AbstractAdminPageController";
import {MarkModel} from "../../models/MarkModel";
import {SimpleVirtualDOM} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOM";
import {AbstractModel} from "../../models/AbstractModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class MarksEditController extends AbstractAdminPageController {

    public modelName: string = 'MarkModel';
    public addFormName: string = 'ClassAddFormView';

    public view: View;
    public component: MarksEditPage;

    public marks: TableComponent;
    public markModel: MarkModel;
    public userModel: UserModel;


    public setup() {
        this.markModel = <MarkModel> JSWorks.applicationContext.modelHolder.getModel('MarkModel');
        this.markModel.subjectFilterId = 0;
        this.marks = (<ComponentElement> this.view.DOMRoot.querySelector('#table')).component;
        this.marks.title = ' ';

        this.marks.controller.onAdd = () => {
            this.marks.loading = true;

            if (this.markModel.subjectFilterId === 0) {
                this.marks.loading = false;
                this.marks.error = 'Выберите предмет!';
                return;
            }

            this.markModel.from({ min: 0, max: 0, name: '',
                        subject_id: this.markModel.subjectFilterId}).create().then(() => {
                this.marks.loading = false;
                this.marks.controller.onQuery(this.marks);
            }).catch((err) => {
                this.marks.loading = false;
                this.marks['error'] = err;
            });
        };

        this.marks.columns = [
            {
                name: 'min',
                title: 'НИЖНЯЯ ГРАНИЦА',
                canEdit: true,
            },
            {
                name: 'max',
                title: 'ВЕРХНЯЯ ГРАНИЦА',
                canEdit: true,
            },
            {
                name: 'name',
                title: 'ОЦЕНКА',
                canEdit: true,
            },
        ];

        const virtualDOM: SimpleVirtualDOM = JSWorks.applicationContext.serviceHolder
                .getServiceByName('SimpleVirtualDOM');
        const select: SimpleVirtualDOMElement = this.view.DOMRoot.querySelector('.subject-marks');
        select.removeChildren();

        CurrentUserHelper.currentUser.then((current: UserModel) => {
            current.professorSubjects().then((subjects: ProfessorSubject[]) => {
                select.removeChildren();

                const option = virtualDOM.createElement('OPTION');
                option.appendChild(virtualDOM.createTextElement('Выберите предмет:'));
                select.appendChild(option);

                subjects.forEach((subject: ProfessorSubject) => {
                    const option = virtualDOM.createElement('OPTION');
                    option.appendChild(virtualDOM.createTextElement(
                            `${subject.id} - ${subject.name}`));
                    select.appendChild(option);
                });

                select.removeEventListeners();
                select.addEventListener('change', () => {
                    this.marks.error = undefined;

                    if ((<string> (<any> select.rendered).value).indexOf('-') < 0) {
                        this.marks.error = 'Выберите предмет!';
                        return;
                    }

                    this.markModel.subjectFilterId = AbstractModel.parseNumber(
                            (<any> select.rendered).value);
                    this.marks.controller.onQuery(this.marks);

                    /*window.setTimeout(() => {
                        this.marks.controller.refresh();
                    }, 1000);*/
                });
            });
        });

        this.marks.controller.refresh();
    }

}
