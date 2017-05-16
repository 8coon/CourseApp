import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {CurrentUserHelper} from "../helpers/CurrentUserHelper";
import {UserModel} from "../models/UserModel";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.RouteAfterNavigateInterceptor })
export class CurrentUserInterceptor {

    public intercept(args: object): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            CurrentUserHelper.currentUser.then((user: UserModel) => {
                if (!args['nextPage']) {
                    return;
                }

                console.log('intercepted', args);

                JSWorks.applicationContext.currentPage['currentUser'] = user;
                console.log(args['nextPage'].currentUser);
                resolve();
            }).catch((err) => {
                resolve();
            });
        });
    }

}
