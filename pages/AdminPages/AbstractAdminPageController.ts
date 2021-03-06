import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {TableComponent} from "../../components/TableComponent/TableComponent";
import {IQuery, QueryBuilder} from "../../helpers/QueryBuilder";
import {IModel} from "jsworks/dist/dts/Model/IModel";
import {WindowComponent} from "../../components/WindowComponent/WindowComponent";
import {FormForElement} from "jsworks/dist/dts/CustomElements/ViewElements/FormElements/FormForElement";
import {AbstractAuthorizingController} from "../AbstractAuthorizingController";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";


declare const JSWorks: JSWorksLib;


export abstract class AbstractAdminPageController extends AbstractAuthorizingController {

    public table: TableComponent;


    public query(query: IQuery): Promise<any> {
        return (<IModel> JSWorks.applicationContext.modelHolder.getModel(this.modelName)).query(query);
    }

    public update(data): Promise<any> {
        return (<IModel> JSWorks.applicationContext.modelHolder.getModel(this.modelName)).from(data).update();
    }

    public ['delete'](data): Promise<any> {
        return (<IModel> JSWorks.applicationContext.modelHolder.getModel(this.modelName)).from(data).delete();
    }

    public abstract setup();
    public abstract modelName: string;
    public abstract addFormName: string;

    public onFormOpen(form: FormForElement): Promise<any> {
        return Promise.resolve();
    }


    public onNavigate(): void {
        super.onNavigate();

        const element: ComponentElement = <ComponentElement> this.view.DOMRoot.querySelector(`#table`);
        this.table = element.component;


        this.table.controller.onQuery = (table: TableComponent) => {
            table.loading = true;

            this.query(QueryBuilder.build(table)).then((result: any[]) => {
                (<any> table.data).setValues(result);
                table.total = (result[0] || { total: 0 }).total;
                (<any> table.columns).update();
                table.controller.refresh();
                table.error = undefined;

                table.loading = false;
            }).catch((err) => {
                table.loading = false;
                table.error = err;
            });
        };


        this.table.controller.onCellChange = (table: TableComponent, data: any) => {
            table.loading = true;

            this.update(data).then(() => {
                this.table.controller.onQuery(table);
            });
        };


        this.table.controller.onRemove = (table: TableComponent, data: any) => {
            table.loading = true;

            this.delete(data).then(() => {
                this.table.controller.onQuery(table);
            });
        };


        this.table.controller.onAdd = () => {
            this.openWindow(this.addFormName, (form: FormForElement) => {
                return this.onFormOpen(form);
            });
        };


        this.setup();
        this.table.controller.onQuery(this.table);
    }


    public openWindow(formViewName: string, onOpen: (form: FormForElement,
                                                     windowView?: View) => Promise<any>): void {
        const windows: WindowComponent = JSWorks.applicationContext.currentPage['view']
            .DOMRoot.querySelector('#modal-root').component;
        const windowView: View = JSWorks.applicationContext.viewHolder.getView(formViewName);
        const form: FormForElement = <FormForElement> windowView.DOMRoot.querySelector('form-for');

        if (form !== undefined) {
            form.clear();

            form.onSuccess = (): boolean => {
                windows.closeLastWindow();
                this.table.controller.onQuery(this.table);

                return true;
            };
        }

        const closeButton: SimpleVirtualDOMElement = windowView.DOMRoot.querySelector('.button-close');
        closeButton.addEventListener('click', () => {
            if (form !== undefined) {
                form.clear();
            }

            windows.closeLastWindow();
        });

        onOpen(form, windowView).then(() => {
            windows.openWindow(windowView);
        }).catch((err) => {
            this.table.error = err;
        });
    }

}