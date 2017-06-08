'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'MarksEditView', controller: 'MarksEditController' })
export class MarksEditPage {

    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;

    @(<any> JSWorks.ComponentProperty())
    public currentUser: UserModel;

}