import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {JSONParserService} from "jsworks/dist/dts/Parser/JSON/JSONParserService";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


@JSWorks.Interceptor({ type: JSWorks.InterceptorType.ValidatorInterceptor })
export class CourseValidator {

    public intercept(args: object): Promise<any> {
        return new Promise((resolve, reject) => {
            if (args['value'].includes(' - ')) {
                resolve();
                return;
            }

            reject('Выберите курс');
        });
    }
}
