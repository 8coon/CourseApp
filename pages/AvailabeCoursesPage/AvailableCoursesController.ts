import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel, StudentAvailableCourse} from "../../models/UserModel";
import {AvailableCoursesPage} from "./AvailableCoursesPage";
import {AbstractAuthorizingController} from "../AbstractAuthorizingController";
import {TableComponent} from "../../components/TableComponent/TableComponent";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {ClassModel, JournalStudent, JournalClass} from "../../models/ClassModel";
import {ITableColumn} from "../../components/TableComponent/ITable";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class AvailableCoursesController extends AbstractAuthorizingController {

    public view: View;
    public component: AvailableCoursesPage;

    public userModel: UserModel;
    public courses: TableComponent;


    public onNavigate(args: object): void {
        super.onNavigate();
        this.userModel = <UserModel> JSWorks.applicationContext.modelHolder.getModel('UserModel');
        this.courses = (<ComponentElement> this.view.DOMRoot.querySelector('#available-courses'))
                .component;
        this.courses.selectable = false;
        this.courses.title = 'Доступные курсы';
        this.courses.loading = true;

        this.userModel.availableCourses().then((courses: StudentAvailableCourse[]) => {
            this.courses.columns = [
                {
                    name: 'name',
                    title: ' ',
                    isTitle: true,
                },
                {
                    name: 'status',
                    title: ' ',
                    type: 'button',
                    buttonText: 'Подать заявку',
                    isTitle: true,

                    onButtonClick: (table: TableComponent, data: StudentAvailableCourse) => {
                        this.component.loading = true;
                        this.component['error'] = undefined;

                        this.userModel.requestCourse(data.id).then(() => {
                            this.component.loading = false;

                            data['_button_status'] = false;
                            data['status'] = 'Заявка отправлена';

                            this.courses.controller.refresh();
                        }).catch((err) => {
                            this.component.loading = false;
                            this.component['error'] = err;
                        });
                    }
                },
            ];

            this.courses.data = courses;

            this.courses.controller.refresh();
            this.courses.loading = false;
            this.courses.error = undefined;
        }).catch((err) => {
            this.courses.loading = false;
            this.courses.error = err;
        });
    }

}
