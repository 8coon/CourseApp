import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {TimetableComponent} from "./TimetableComponent";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class TimetableController {

    public view: View;
    public component: TimetableComponent;

    private patched: boolean = false;


    public onCreate(): void {
    }


}
