import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel, StudentCourse, StudentInfo} from "../../models/UserModel";
import {MainPage} from "./MainPage";
import {AbstractAuthorizingController} from "../AbstractAuthorizingController";
import {IModel} from "jsworks/dist/dts/Model/IModel";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {TableComponent} from "../../components/TableComponent/TableComponent";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class MainController extends AbstractAuthorizingController {

    public view: View;
    public component: MainPage;


    public onNavigate(args: object): void {
        super.onNavigate();

        CurrentUserHelper.currentUser.then((current: UserModel) => {
            switch (current.role) {

                case 1: {
                    current.info().then((courses: StudentCourse[]) => {
                        this.component.studentCourses = courses;

                        const findCourse = (id: number): StudentCourse => {
                            let course: StudentCourse;

                            courses.forEach((c: StudentCourse) => {
                                if (c.course_id === id) {
                                    course = c;
                                }
                            });

                            return course;
                        };

                        window.setTimeout(() => {
                            this.view.DOMRoot.querySelectorAll('.student-stat-table').forEach(
                                    (tableElement: ComponentElement) => {
                                const table: TableComponent = tableElement.component;
                                const course: StudentCourse = findCourse(
                                        parseInt(tableElement.id.replace('course-', ''), 10));
                                table.title = course.course_name;

                                table.columns = [
                                    {
                                        name: 'subject_name',
                                        title: 'ПРЕДМЕТ',
                                    },
                                    {
                                        name: 'total',
                                        title: '∑',
                                        pixelWidth: 25,
                                    },
                                    {
                                        name: 'mark_name',
                                        title: 'ОЦЕНКА',
                                    },
                                ];

                                table.data = course.subjects;
                                table.controller.refresh();
                                tableElement.render();
                            });
                        }, 10);
                    });
                } break;

            }
        });

        /*CurrentUserHelper
            .getInfo()
            .then(data => {
                console.log(data, data.requests);
                this.component.info = data;
            });*/

    }

}
