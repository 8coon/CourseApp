import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class LandingController {

    public view: View;


    public onCreate(): void {
        this.view.DOMRoot.querySelector('h1').addEventListener('click', (event) => {
            alert('clicked!');
        });
    }


    public onNavigate(args: object): void {
    }

}
