import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel} from "../../models/UserModel";
import {JournalPage} from "./JournalPage";
import {AbstractAuthorizingController} from "../AbstractAuthorizingController";
import {TableComponent} from "../../components/TableComponent/TableComponent";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {ClassModel, JournalStudent, JournalClass} from "../../models/ClassModel";
import {ITableColumn} from "../../components/TableComponent/ITable";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class JournalController extends AbstractAuthorizingController {

    public view: View;
    public component: JournalPage;

    public journal: TableComponent;
    public groupId: number;
    public subjectId: number;
    public classModel: ClassModel;


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
        if (journalClass.mark === undefined) {
            return 'Н';
        }

        return `${journalClass.mark.mark}`;
    }


    public static formatComment(comment: string): string{
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

        this.classModel.journal(this.groupId, this.subjectId).then((students: JournalStudent[]) => {
            if (students.length === 0) {
                this.journal.loading = false;
                this.journal.error = 'Занятия по данному предмету у этой группы не найдены.';

                return;
            }

            this.journal.columns = students[0].classes.map((journalClass: JournalClass) => {
                return {
                    name: `class_${journalClass.class_id}`,
                    title: JournalController.formatDate(journalClass.class_begin_date),
                }
            });

            this.journal.data = students.map((student: JournalStudent) => {
                student.classes.forEach((journalClass: JournalClass) => {
                    student[`class_${journalClass.class_id}`] =
                            JournalController.formatAttendance(journalClass);

                    if (journalClass.mark && journalClass.mark.comment !== undefined) {
                        student[`_tooltip__class_${journalClass.class_id}`] =
                                JournalController.formatComment(journalClass.mark.comment);
                    }
                });

                return student;
            });

            this.journal.controller.refresh();
            this.journal.loading = false;
            this.journal.error = undefined;
        }).catch((err) => {
            this.journal.loading = false;
            this.journal.error = err;
        });
    }

}
