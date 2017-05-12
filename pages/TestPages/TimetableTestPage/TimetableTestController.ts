import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {TimetableComponent} from "../../../components/TimetableComponent/TimetableComponent";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class TimetableTestController {

    public view: View;


    public onCreate(): void {
        window.setInterval(() => {
            const timetable: TimetableComponent =
                (<ComponentElement> this.view.DOMRoot.querySelector('#timetable')).component;
            timetable.loading = !timetable.loading;
        }, 2000);
    }

}
