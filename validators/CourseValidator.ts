import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.ValidatorInterceptor })
export class CourseValidator {

    public intercept(args: object): Promise<any> {
        return new Promise((resolve, reject) => {
            if (args['value'].includes(' - ')) {
                resolve();
                return;
            }

            reject('Выберите значение');
        });
    }
}
