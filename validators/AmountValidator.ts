import {JSWorksLib} from "jsworks/dist/dts/jsworks";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.ValidatorInterceptor })
export class AmountValidator {

    public intercept(args: object): Promise<any> {
        return new Promise((resolve, reject) => {
            const value: number = parseInt(args['value'], 10);

            if (value < 1) {
                reject('Значение не может быть меньше 1!');
            }

            if (value > 40) {
                reject('Значение не может быть больше 40!');
            }

            resolve();
        });
    }
}
