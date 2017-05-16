'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'MainView', controller: 'MainController' })
export class MainPage {


    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;


}