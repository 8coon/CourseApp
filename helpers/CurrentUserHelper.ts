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
                                .then(data => {
                                    console.log(data);
                                    data = [
                                        {
                                            course_id: 1,
                                            course_name: 'technopark 2 sem',
                                            group_id: 1,
                                            group_name: "AПО-21",
                                            subjects: [
                                                {subject_id: 1, subject_name: "DataBase", total: 80, mark_name: 'хор'},
                                                {
                                                    subject_id: 2,
                                                    subject_name: "Front-end",
                                                    total: 100,
                                                    mark_name: 'отл'
                                                },
                                                {subject_id: 3, subject_name: "Back-end", total: 50, mark_name: 'удовл'}
                                            ]
                                        },
                                        {
                                            course_id: 2,
                                            course_name: 'technopark 3 sem',
                                            group_id: 2,
                                            group_name: "AПО-31",
                                            subjects: [
                                                {subject_id: 4, subject_name: "Android", total: 100, mark_name: 'отл'},
                                                {subject_id: 5, subject_name: "Security", total: 89, mark_name: 'отл'},
                                                {subject_id: 6, subject_name: "Hightload", total: 49, mark_name: 'хор'}
                                            ]
                                        }
                                    ];
                                    resolve(data);
                                });
                            break;

                        case 2:
                            (<IModel> user).jsonParser.parseURLAsync(JSWorks.config['backendURL'] + '/professor/info',
                                JSWorks.HTTPMethod.GET)
                                .then(data => {
                                    console.log(data);

                                    data = [
                                        {
                                            course_id: 1,
                                            course_name: 'technopark 2 sem',
                                            subject_id: 1,
                                            subject_name: 'Front-end',
                                            groups: [
                                                {group_id: 1, group_name: 'АПО-21'},
                                                {group_id: 2, group_name: 'АПО-22'}
                                            ]
                                        },
                                        {
                                            course_id: 1,
                                            course_name: 'technopark 2 sem',
                                            subject_id: 2,
                                            subject_name: 'Java',
                                            groups: [
                                                {group_id: 1, group_name: 'АПО-21'},
                                                {group_id: 2, group_name: 'АПО-22'}
                                            ]
                                        }
                                        ];

                                    resolve(data);
                                });
                            break;
                    }
                })
        })

    }

}
