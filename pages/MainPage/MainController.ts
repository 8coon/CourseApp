import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {CurrentUserHelper} from "../../helpers/CurrentUserHelper";
import {UserModel} from "../../models/UserModel";
import {MainPage} from "./MainPage";
import {AbstractAuthorizingController} from "../AbstractAuthorizingController";
import {IModel} from "jsworks/dist/dts/Model/IModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class MainController extends AbstractAuthorizingController {

    public view: View;
    public component: MainPage;


    public onCreate(): void {
        // this.view.DOMRoot.querySelector('h1').addEventListener('click', (event) => {
        //     alert('clicked!');
        // });
    }


    public onNavigate(args: object): void {
        super.onNavigate();

        CurrentUserHelper
            .getInfo()
            .then(data => {
                console.log(data, data.requests);
                this.component.info = data;
            });

    }

}
