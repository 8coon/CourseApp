'use strict';
import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../models/UserModel";
import {MarkModelFields} from "../../models/MarkModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'JournalView', controller: 'JournalController' })
export class JournalPage {

    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;

    @(<any> JSWorks.ComponentProperty())
    public currentUser: UserModel;

    @(<any> JSWorks.ComponentCollectionProperty())
    public marks: MarkModelFields[] = [];

}