import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.FormBeforeSubmitInterceptor })
export class FormBeforeSubmitInterceptor {

    public intercept(args: object): Promise<any> {
        (<any> JSWorks.applicationContext.currentPage).loading = true;
        (<any> JSWorks.applicationContext.currentPage).error = undefined;

        return Promise.resolve();
    }

}


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.FormAfterSubmitInterceptor })
export class FormAfterSubmitInterceptor {

    public intercept(args: object): Promise<any> {
        (<any> JSWorks.applicationContext.currentPage).loading = false;

        if (!args['success']) {
            (<any> JSWorks.applicationContext.currentPage).error = args['result'];
        }

        if (args['result'] !== undefined) {
            args['form'].clear();
        }

        return Promise.resolve();
    }

}
