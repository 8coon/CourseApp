'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'AvailableCoursesView', controller: 'AvailableCoursesController' })
export class AvailableCoursesPage {

    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;

    @(<any> JSWorks.ComponentProperty())
    public currentUser: UserModel;

}