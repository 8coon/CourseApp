import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {JSONParserService} from "jsworks/dist/dts/Parser/JSON/JSONParserService";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.ValidatorInterceptor })
export class TimeValidator {

    public intercept(args: object): Promise<any> {
        return new Promise((resolve, reject) => {
            if (/^\d{1,2}:\d{1,2}$/g.exec(String(args['value']))) {
                resolve();
                return;
            }

            reject('Неправильный формат времени! Ожидается: 00:00');
        });
    }
}
