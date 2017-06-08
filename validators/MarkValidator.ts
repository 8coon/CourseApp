import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.ValidatorInterceptor })
export class MarkValidator {

    public intercept(args: object): Promise<any> {
        return new Promise((resolve, reject) => {
            if (args['value'].length === 0) {
                resolve();
                return;
            }

            const value: number = parseInt(args['value'], 10);

            if (value < 0) {
                reject('Значение не может быть меньше 0!');
                return;
            }

            if (value > 100) {
                reject('Значение не может быть больше 100!');
                return;
            }

            resolve();
        });
    }
}
