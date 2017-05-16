import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {TableComponent} from "../../components/TableComponent/TableComponent";
import {IQuery, QueryBuilder} from "../../helpers/QueryBuilder";


declare const JSWorks: JSWorksLib;


export abstract class AbstractAdminPageController {

    public view: View;
    public table: TableComponent;


    public abstract query(query: IQuery): Promise<any[]>;
    public abstract setup();


    public onNavigate(): void {
        const element: ComponentElement = <ComponentElement> this.view.DOMRoot.querySelector(`#table`);
        this.table = element.component;

        this.table.controller.onQuery = (table: TableComponent) => {
            this.query(QueryBuilder.build(table)).then((result: any[]) => {
                (<any> table.data).setValues(result);
                (<any> table.columns).update();
                table.controller.refresh();
            });
        };

        this.setup();
        this.table.controller.onQuery(this.table);
    }

}