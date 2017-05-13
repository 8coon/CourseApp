import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {TimetableComponent} from "../../../components/TimetableComponent/TimetableComponent";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class TimetableTestController {

    public view: View;


    public onCreate(): void {
        const trigger1 = () => {
            const element: ComponentElement = <ComponentElement> this.view.DOMRoot.querySelector(`#timetable1`);
            const timetable: TimetableComponent = element.component;

            timetable.loading = !timetable.loading;

            window.setTimeout(trigger1, 1000 +  Math.random() * 4000);
        };

        const trigger2 = () => {
            const element: ComponentElement = <ComponentElement> this.view.DOMRoot.querySelector(`#timetable2`);
            const timetable: TimetableComponent = element.component;

            timetable.loading = !timetable.loading;

            window.setTimeout(trigger2, 1000 +  Math.random() * 4000);
        };

        // window.setTimeout(trigger1, 1000);
        // window.setTimeout(trigger2, 1000);
    }

}
