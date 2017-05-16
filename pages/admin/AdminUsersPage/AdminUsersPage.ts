import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../../../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Page({ view: 'AdminUsersView', controller: 'AdminUsersController' })
export class AdminUsersPage {

    @(<any> JSWorks.ComponentProperty())
    public dummy: string = '';


    @(<any> JSWorks.ComponentProperty())
    public currentUser: UserModel;

}