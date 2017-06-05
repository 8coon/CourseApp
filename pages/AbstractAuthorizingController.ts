import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {CurrentUserHelper} from "../helpers/CurrentUserHelper";
import {UserModel} from "../models/UserModel";


declare const JSWorks: JSWorksLib;


export abstract class AbstractAuthorizingController {

    public view: View;
    public component;


    public onNavigate(args?: object): void {
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
        }).catch((error) => {
            this.view.DOMRoot.setStyleAttribute('display', 'inherit');
            this.component.loading = false;

            JSWorks.applicationContext.router.navigate(
                JSWorks.applicationContext.routeHolder.getRoute('LandingRoute'),
                {},
            );
        })
    }

}
