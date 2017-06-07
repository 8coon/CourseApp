import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {UserModel} from "../models/UserModel";
import {IModel} from "jsworks/dist/dts/Model/IModel";


declare const JSWorks: JSWorksLib;


export class CurrentUserHelper {

    public static _currentUser: UserModel;


    public static get currentUser(): Promise<UserModel> {
        const model: UserModel = <UserModel> JSWorks.applicationContext.modelHolder.getModel('UserModel');

        if (!CurrentUserHelper._currentUser) {
            return new Promise<UserModel>((resolve, reject) => {
                model.current().then((user: UserModel) => {
                    CurrentUserHelper.currentUser = Promise.resolve(user);
                    resolve(user);
                });
            });
        }

        return Promise.resolve(CurrentUserHelper._currentUser);
    }


    public static set currentUser(value: Promise<UserModel>) {
        value.then((result: UserModel) => {
            CurrentUserHelper._currentUser = result;
        });
    }

    public static getInfo(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            CurrentUserHelper
                .currentUser
                .then((user: UserModel) => {

                    switch (user.role) {
                        case 0:
                            (<IModel> user).jsonParser.parseURLAsync(JSWorks.config['backendURL'] + '/admin/info',
                                JSWorks.HTTPMethod.GET)
                                .then(data => resolve(data));
                            break;

                        case 1:
                            (<IModel> user).jsonParser.parseURLAsync(JSWorks.config['backendURL'] + '/student/info',
                                JSWorks.HTTPMethod.GET)
                                .then(data => resolve(data));
                            break;

                        case 2:
                            (<IModel> user).jsonParser.parseURLAsync(JSWorks.config['backendURL'] + '/professor/info',
                                JSWorks.HTTPMethod.GET)
                                .then(data => resolve(data));
                            break;
                    }
                })
        })

    }

}
