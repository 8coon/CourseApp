import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {AbstractAuthorizingController} from "../AbstractAuthorizingController";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class SignUpController {

    public view: View;
    public form: FormForElement;


    public onCreate(): void {
        this.form = <FormForElement> this.view.DOMRoot.querySelector('#SignUpForm');

        this.form.onSuccess = (form: FormForElement, data: object): boolean => {
            this.form.clear();

            window.setTimeout(() => {
                JSWorks.applicationContext.router.navigate(
                    JSWorks.applicationContext.routeHolder.getRoute('LoginRoute'),
                    { [':email']: data['email'] },
                )
            }, 10);

            return true;
        }
    }


    public onNavigate(args: object): void {
        this.onCreate();
    }

}
