'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'LandingView', controller: 'LandingController' })
export class LandingPage {


    @(<any> JSWorks.ComponentProperty())
    public testA: string;


    @(<any> JSWorks.ComponentProperty({ onChange: 'onTestBChange' }))
    public testB: string = 'default';


    @(<any> JSWorks.ComponentProperty({ mapping: '#h2@innerHTML' }))
    public testC: string;


}