import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel} from "../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class LandingController {

    public view: View;


    public onCreate(): void {
    }


    public onNavigate(args: object): void {
        if (args[':random']) {
            CurrentUserHelper.currentUser = (<UserModel> JSWorks.applicationContext.modelHolder
                    .getModel('UserModel')).logout();
        }

        window.setTimeout(() => {
            JSWorks.applicationContext.router.navigate(
                JSWorks.applicationContext.routeHolder.getRoute('LoginRoute'),
                {},
            )
        }, 10);
    }

}
