import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {TimetableComponent} from "./TimetableComponent";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class TimetableController {

    public view: View;
    public component: TimetableComponent;

    public onLeftClick: (timetable: TimetableComponent) => void;
    public onRightClick: (timetable: TimetableComponent) => void;


    public onDOMInsert(): void {
        this.view.DOMRoot.querySelector('.timetable-arrow-left').addEventListener('click', () => {
            if (this.onLeftClick) {
                this.onLeftClick(this.component);
            }
        });

        this.view.DOMRoot.querySelector('.timetable-arrow-right').addEventListener('click', () => {
            if (this.onRightClick) {
                this.onRightClick(this.component);
            }
        });
    }


}
