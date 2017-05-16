import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class LandingController {

    public view: View;


    public onCreate(): void {
    }


    public onNavigate(args: object): void {
        window.setTimeout(() => {
            JSWorks.applicationContext.router.navigate(
                JSWorks.applicationContext.routeHolder.getRoute('LoginRoute'),
                {},
            )
        }, 10);
    }

}
