import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel} from "../../models/UserModel";
import {JournalPage} from "./JournalPage";
import {AbstractAuthorizingController} from "../AbstractAuthorizingController";
import {TableComponent} from "../../components/TableComponent/TableComponent";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {ClassModel, JournalStudent, JournalClass, JournalEntry, JournalClassMark} from "../../models/ClassModel";
import {ITableColumn} from "../../components/TableComponent/ITable";
import {WindowComponent} from "../../components/WindowComponent/WindowComponent";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class JournalController extends AbstractAuthorizingController {

    public view: View;
    public component: JournalPage;

    public journal: TableComponent;
    public groupId: number;
    public subjectId: number;
    public classModel: ClassModel;

    public formViewName: string = 'AddAttendanceFormView';


    public static formatDate(date: Date): string {
        const format = (i: number): string => {
            if (i < 10) {
                return `0${i}`;
            }

            return `${i}`;
        };

        return `${format(date.getDate())}.${format(date.getMonth())}`;
    }


    public static formatAttendance(journalClass: JournalClass): string {
        if (!journalClass.mark) {
            return 'Н';
        }

        return `${journalClass.mark.mark}`;
    }


    public static formatComment(comment: string): string {
        if (comment.length < 50) {
            return comment;
        }

        return `${comment.slice(0, 48)}..`;
    }


    public onNavigate(args: object): void {
        super.onNavigate();
        this.journal = (<ComponentElement> this.view.DOMRoot.querySelector('#journal')).component;

        const groupAndSubjectIds: string[] = (args[':group_and_subject_ids'] || '0-0').split('-');
        this.groupId = parseInt(groupAndSubjectIds[0], 10) || 0;
        this.subjectId = parseInt(groupAndSubjectIds[1], 10) || 0;

        this.journal.loading = true;
        this.classModel = <ClassModel> JSWorks.applicationContext.modelHolder.getModel('ClassModel');

        this.classModel.journal(this.groupId, this.subjectId).then((data: JournalEntry) => {
            this.journal.title = `Журнал группы ${data.group_name} по предмету "${data.subject_name}"`;
            this.journal.selectable = false;

            if (data.entries.length === 0) {
                this.journal.loading = false;
                this.journal.error = 'Занятия по данному предмету у этой группы не найдены.';

                return;
            }

            this.journal.columns = [{
                name: 'name',
                title: ' ',
                isTitle: true,
            }];

            this.journal.columns = (<any> this.journal.columns).getValues().concat(
                    data.entries[0].classes.map((journalClass: JournalClass) => {
                return {
                    name: `class_${journalClass.class_id}`,
                    title: JournalController.formatDate(journalClass.class_begin_date),
                    pixelWidth: 25,
                    verticalTitle: true,
                }
            }));

            this.journal.data = data.entries.map((student: JournalStudent) => {
                student['name'] = `${student.student_last_name} ${student.student_first_name}`;

                student.classes.forEach((journalClass: JournalClass) => {
                    student[`class_${journalClass.class_id}`] =
                            JournalController.formatAttendance(journalClass);

                    if (journalClass.mark && !!journalClass.mark.comment) {
                        student[`_tooltip_class_${journalClass.class_id}`] =
                                JournalController.formatComment(journalClass.mark.comment);
                    }
                });

                return student;
            });

            const windows: WindowComponent = JSWorks.applicationContext.currentPage['view']
                    .DOMRoot.querySelector('#modal-root').component;
            const windowView: View = JSWorks.applicationContext.viewHolder.getView(this.formViewName);
            let opened: boolean = false;

            const closeButton: SimpleVirtualDOMElement = windowView.DOMRoot
                    .querySelector('.button-close');
            closeButton.removeEventListeners();

            closeButton.addEventListener('click', () => {
                opened = false;
                windows.closeLastWindow();
            });

            const check: SimpleVirtualDOMElement = windowView.DOMRoot
                    .querySelector('#check-has-attendance');
            check.removeEventListeners();

            check.addEventListener('change', () => {
                const dynamic: SimpleVirtualDOMElement[] = windowView.DOMRoot
                        .querySelectorAll('.journal-can-be-disabled');

                dynamic.forEach((element: SimpleVirtualDOMElement) => {
                    if ((<HTMLInputElement> check.rendered).checked) {
                        element.removeAttribute('disabled');
                    } else {
                        element.setAttribute('disabled', 'disabled');
                    }
                });
            });

            this.journal.onCellClick = (table: TableComponent, row: number, column: number,
                    data: JournalStudent) => {
                CurrentUserHelper.currentUser.then((current: UserModel) => {
                    if (opened || current.role !== 2) {
                        return;
                    }

                    const journalClass: JournalClass = data.classes[column - 1];
                    const mark: JournalClassMark = journalClass.mark;
                    (<HTMLInputElement> check.rendered).checked = !(!mark);
                    (<HTMLInputElement> check.rendered).dispatchEvent(new Event('change'));

                    const markInput: HTMLInputElement = <HTMLInputElement> windowView.DOMRoot
                            .querySelector('#attendance-mark').rendered;
                    const commentInput: HTMLInputElement = <HTMLInputElement> windowView.DOMRoot
                            .querySelector('#attendance-comment').rendered;

                    if (mark) {
                        markInput.value = `${mark.mark}`;
                        commentInput.value = mark.comment;
                    } else {
                        markInput.value = '';
                        commentInput.value = '';
                    }

                    markInput.dispatchEvent(new Event('change'));
                    windows.openWindow(windowView);
                    opened = true;

                    const form: FormForElement = <FormForElement> windowView.DOMRoot
                            .querySelector('#AttendanceForm');

                    form.modelSaveCallback = (): Promise<any> => {
                        this.component.loading = true;

                        return this.classModel.attend(journalClass.class_id, data.student_id,
                                (<HTMLInputElement> check.rendered).checked,
                                {
                                    mark: parseInt(markInput.value || '0', 10),
                                    comment: commentInput.value,
                                },
                        ).then(() => {
                            this.component.loading = false;
                            this.component['error'] = undefined;

                            opened = false;
                            this.onNavigate(args);
                            windows.closeLastWindow();
                        }).catch((err) => {
                            this.component.loading = false;
                            this.component['error'] = err;

                            opened = false;
                            windows.closeLastWindow();
                        });
                    }
                });
            };

            this.journal.controller.refresh();
            this.journal.loading = false;
            this.journal.error = undefined;
        }).catch((err) => {
            this.journal.loading = false;
            this.journal.error = err;
        });
    }

}
