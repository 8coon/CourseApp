import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {ITableColumn} from "./ITable";
import {TableController} from "./TableController";


declare const JSWorks: JSWorksLib;


@JSWorks.Component({ view: 'TableView', controller: 'TableController' })
export class TableComponent {

    public controller: TableController;


    @(<any> JSWorks.ComponentProperty())
    public title: string = 'Table';


    @(<any> JSWorks.ComponentProperty())
    public selectable: boolean = true;


    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;

    @(<any> JSWorks.ComponentProperty())
    public error: string;


    @(<any> JSWorks.ComponentProperty())
    public selectedRow: number;


    public offset: number = 0;
    public limit: number = 20;
    public total: number = 1483;


    public isEditing: boolean = false;


    @(<any> JSWorks.ComponentCollectionProperty())
    public columns: ITableColumn[] = [];


    @(<any> JSWorks.ComponentCollectionProperty())
    public data: any[] = [];

}