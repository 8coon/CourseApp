import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {ITableColumn} from "./ITable";


declare const JSWorks: JSWorksLib;


@JSWorks.Component({ view: 'TableView', controller: 'TableController' })
export class TableComponent {


    @(<any> JSWorks.ComponentProperty())
    public title: string = 'Table';


    @(<any> JSWorks.ComponentCollectionProperty())
    public columns: ITableColumn[] = [
        {
            name: 'id',
            title: 'КОД',
            width: 0.1,
            order: 'asc',
            canOrder: true,
            isTitle: true,
        },
        {
            name: 'name',
            title: 'ИМЯ',
            width: 0.4,
            canOrder: true,
            canEdit: true,
            canFilter: true,
        },
        {
            name: 'key',
            title: 'КЛЮЧ',
            width: 0.1,
            canOrder: true,
        },
    ];


    @(<any> JSWorks.ComponentCollectionProperty())
    public data: any[] = [
        { id: 1, name: 'Lol', key: 3303 },
        { id: 2, name: 'Kek', key: 3304 },
        { id: 3, name: 'Cheburek', key: 3309 },
    ];

}