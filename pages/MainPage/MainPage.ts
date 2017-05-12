'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'MainView', controller: 'MainController' })
export class MainPage {


    @(<any> JSWorks.ComponentProperty())
    public testA: string;


    @(<any> JSWorks.ComponentProperty({ onChange: 'onTestBChange' }))
    public testB: string = 'default';


    @(<any> JSWorks.ComponentProperty({ mapping: '#h2@innerHTML' }))
    public testC: string;


}