'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'MainView', controller: 'MainController' })
export class MainPage {

    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;

    @(<any> JSWorks.ComponentProperty())
    public currentUser: UserModel;

    @(<any> JSWorks.ComponentProperty())
    public info: any;

}