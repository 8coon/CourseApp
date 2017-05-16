'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'LandingView', controller: 'LandingController' })
export class LandingPage {


    @(<any> JSWorks.ComponentProperty())
    public dummy: string = '';


}