import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {FormFieldElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormFieldElement";
import {LoginPage} from "./LoginPage";
import {UserModel} from "../../models/UserModel";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class LoginController {

    public view: View;
    public component: LoginPage;
    public form: FormForElement;


    public onCreate(): void {
        this.form = <FormForElement> this.view.DOMRoot.querySelector('#LoginForm');

        this.form.modelSaveCallback = (): Promise<any> => {
            return (<UserModel> this.form.model).login().then((result) => {
                console.log(result);

                 CurrentUserHelper.currentUser = Promise.resolve(
                    JSWorks.applicationContext.modelHolder.getModel('UserModel').from(result),
                 );

                 window.setTimeout(() => {
                     JSWorks.applicationContext.router.navigate(
                         JSWorks.applicationContext.routeHolder.getRoute('MainRoute'),
                         {},
                     )
                 });

                 this.form.clear();
            }).catch((err) => {
                this.component.error = 'Неправильный логин или пароль!';
            })
        };
    }


    public onNavigate(args: object): void {
        this.onCreate();
        this.component.email = undefined;

        if (args[':email']) {
            this.component.email = args[':email'];

            this.form.fields.forEach((field: FormFieldElement) => {
                if (field.getAttribute('for') !=='email') {
                    return;
                }

                field.value = args[':email'];
            })
        }
    }

}
