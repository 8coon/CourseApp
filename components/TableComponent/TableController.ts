import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {SimpleVirtualDOMElement} from "jsworks/dist/dts/VirtualDOM/SimpleVirtualDOM/SimpleVirtualDOMElement";
import {TableComponent} from "./TableComponent";
import {ITableColumn} from "./ITable";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class TableController {

    public view: View;
    public component: TableComponent;

    public onCellChange: (table: TableComponent, data: object) => void;
    public onQuery: (table: TableComponent) => void;


    public triggerRefresh(): any[] {
        const values = (<any> this.component.columns).getValues();
        (<any> this.component.columns).clear();

        return values;
    }


    public onDOMInsert(): void {
        this.view.DOMRoot.querySelector('.table-drop-filters-button').addEventListener('click', (event) => {
            event.stopPropagation();
            this.clearFilterButtonState();

            const values = this.triggerRefresh();

            (<any> this.component.columns).setValues(values.map((column: ITableColumn) => {
                const returning: ITableColumn = { name: '', title: '' };

                Object.keys(column).forEach((keyName: string) => {
                    returning[keyName] = column[keyName];
                });

                returning.filter = undefined;
                returning.order = undefined;
                return returning;
            }));
        });
    }


    public refresh(): void {
        const values = this.triggerRefresh();
        (<any> this.component.columns).setValues(values);
    }


    private patchSorter(column: SimpleVirtualDOMElement, colData: ITableColumn): void {
        const sorter: SimpleVirtualDOMElement = column.querySelector('.table-column-sorter');

        if (!sorter || sorter['_tablePatched']) {
            return;
        }

        sorter.addEventListener('click', (event) => {
            event.stopPropagation();

            switch (colData.order) {

                case 'asc': {
                    colData.order = undefined;
                } break;

                case 'desc': {
                    colData.order = 'asc';
                } break;

                case undefined: {
                    colData.order = 'desc';
                }

            }

            this.refresh();

            if (this.onQuery) {
                this.onQuery(this.component);
            }
        });

        sorter['_tablePatched'] = true;
    }


    private clearFilterButtonState(): void {
        const button = this.view.DOMRoot.querySelector('.table-filter button');

        button.removeEventListeners('click');
        button.parentNode.removeEventListeners('click');
        button.parentNode['_tablePatched'] = undefined;
    }


    private patchFilter(column: SimpleVirtualDOMElement, colData: ITableColumn): void {
        const filter: SimpleVirtualDOMElement = column.querySelector('.table-column-filter');

        if (!filter || filter['_tablePatched']) {
            return;
        }

        filter.addEventListener('click', (event) => {
            event.stopPropagation();

            const input: SimpleVirtualDOMElement = this.view.DOMRoot.querySelector('.table-filter');
            const boundingRect = (<any> filter.rendered).getBoundingClientRect();

            input.setStyleAttribute('left', Math.floor(boundingRect.left) + 'px');
            input.setStyleAttribute('top', Math.floor(boundingRect.top) + 'px');
            input.setStyleAttribute('display', 'inline-block');
            (<any> input.rendered).value = colData.filter || '';

            const button = this.view.DOMRoot.querySelector('.table-filter button');

            if (!document.body['_tablePatched']) {
                document.body.addEventListener('click', () => {
                    input.setStyleAttribute('display', 'none');
                });

                document.body['_tablePatched'] = true;
            }

            if (!button.parentNode['_tablePatched']) {
                const dummyClickListener = (event) => {
                    event.stopPropagation();
                };

                const buttonClickListener = () => {
                    input.setStyleAttribute('display', 'none');

                    const value: string = (<any> input.querySelector('input').rendered).value;
                    const oldFilter: string = colData.filter;

                    if ((value || '').length > 0) {
                        colData.filter = value;
                    } else {
                        colData.filter = undefined;
                    }

                    if (oldFilter === colData.filter) {
                        return;
                    }

                    this.clearFilterButtonState();
                    this.refresh();

                    if (this.onQuery) {
                        this.onQuery(this.component);
                    }
                };

                button.addEventListener('click', buttonClickListener);
                button.parentNode.addEventListener('click', dummyClickListener);
                button.parentNode['_tablePatched'] = true;
            }
        });

        filter['_tablePatched'] = true;
    }


    public onUpdate(): void {
        this.view.DOMRoot.querySelectorAll('.table-column').forEach((column: SimpleVirtualDOMElement) => {
            const colData: ITableColumn = (<any> this.component.columns).get(parseInt(column.getAttribute('column')));

            this.patchSorter(column, colData);
            this.patchFilter(column, colData);
        });


        this.view.DOMRoot.querySelectorAll('.table-cell').forEach((cell: SimpleVirtualDOMElement) => {
            if (cell['_tablePatched']) {
                return;
            }

            const columnIndex: number = parseInt(cell.getAttribute('column'), 10);
            const column: ITableColumn = (<any> this.component.columns).get(columnIndex);

            if (column.canEdit) {
                cell.addEventListener('dblclick', () => {
                    const text: string = (<any> this.component.data).get(
                            parseInt(cell.getAttribute('row'), 10))[column.name];
                    const viewEval: SimpleVirtualDOMElement = cell.querySelector('view-eval');

                    viewEval.removeChildren();

                    const input: SimpleVirtualDOMElement = JSWorks.applicationContext.serviceHolder.
                            getServiceByName('SimpleVirtualDOM').createElement('INPUT');
                    input.setAttribute('value', text);

                    input.addEventListener('blur', () => {
                        const data = (<any> this.component.data).get(parseInt(cell.getAttribute('row'), 10));
                        data[column.name] = (<any> input.rendered).value;
                        this.refresh();

                        if (this.onCellChange) {
                            this.onCellChange(this.component, data);
                        }
                    });

                    viewEval.appendChild(input);
                });
            }

            cell['_tablePatched'] = true;
        });
    }

}
