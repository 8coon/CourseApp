import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'AdminRequestsView', controller: 'AdminRequestsController' })
export class AdminRequestsPage {

    @(<any> JSWorks.ComponentProperty())
    public dummy: string = '';


    @(<any> JSWorks.ComponentProperty())
    public currentUser: UserModel;

}