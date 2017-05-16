import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel} from "../../models/UserModel";
import {MainPage} from "./MainPage";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class MainController {

    public view: View;
    public component: MainPage;


    public onCreate(): void {
        this.view.DOMRoot.querySelector('h1').addEventListener('click', (event) => {
            alert('clicked!');
        });
    }


    public onNavigate(args: object): void {
        this.view.DOMRoot.setStyleAttribute('display', 'none');
        this.component.loading = true;

        CurrentUserHelper.currentUser.then((user: UserModel) => {
            this.view.DOMRoot.setStyleAttribute('display', 'inherit');
            this.component.loading = false;

            if (!user.loggedIn()) {
                JSWorks.applicationContext.router.navigate(
                    JSWorks.applicationContext.routeHolder.getRoute('LandingRoute'),
                    {},
                );

                return;
            }
        });
    }

}
