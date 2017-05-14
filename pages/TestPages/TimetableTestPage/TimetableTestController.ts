import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {View} from "jsworks/dist/dts/View/View";
import {TimetableComponent} from "../../../components/TimetableComponent/TimetableComponent";
import {ComponentElement} from "jsworks/dist/dts/CustomElements/ViewElements/ComponentElement";
import {TableComponent} from "../../../components/TableComponent/TableComponent";


declare const JSWorks: JSWorksLib;


@JSWorks.Controller
export class TimetableTestController {

    public view: View;


    public onCreate(): void {
        const trigger = () => {
            const element: ComponentElement = <ComponentElement> this.view.DOMRoot.querySelector(`#timetable`);
            const timetable: TimetableComponent = element.component;

            timetable.loading = !timetable.loading;

            window.setTimeout(trigger, 1000 +  Math.random() * 4000);
        };

        // window.setTimeout(trigger, 1000);

        window.setTimeout(() => {
            const element: ComponentElement = <ComponentElement> this.view.DOMRoot.querySelector(`#table`);
            const table: TableComponent = element.component;

            const query = () => {
                const data = [];

                for (let i = 0; i < 20; i++) {
                    const names = ['Lol', 'Kek', 'Cheburek', 'Max Kekker', 'Adolf Hitlerovich'];
                    const professors = ['Mr. Katz', 'prof. Galina Ivanovna'];

                    data.push({
                        id: i + 1,
                        name: names[Math.floor(Math.random() * names.length)],
                        key: Math.floor(Math.random() * 4000),
                        professor: professors[Math.floor(Math.random() * professors.length)],
                    });
                }

                (<any> table.data).setValues(data);
                (<any> table.columns).update();
            };

            table.controller.onQuery = query;
            query();

            (<any> table.columns).setValues([
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
                    canOrder: true,
                    canEdit: true,
                    canFilter: true,
                },
                {
                    name: 'key',
                    title: 'КЛЮЧ',
                    width: 0.1,
                    canOrder: true,
                    foreignKey: {
                        route: 'TimetableTestRoute',
                        valueKey: 'key',
                    }
                },
                {
                    name: 'visit',
                    title: 'КНОПКА',
                    width: 0.1,
                    type: 'button',
                    buttonText: 'Выкинуть',
                    onButtonClick: (table, data) => { alert(`${data.name} выкинут!`); },
                },
                {
                    name: 'professor',
                    title: 'ПРЕПОДАВАТЕЛЬ',
                    canOrder: true,
                    canEdit: true,
                    canFilter: true,
                    type: 'select',
                    selectList: [
                        'Mr. Catz',
                        'prof. Galina Ivanova',
                    ],
                }
            ]);
        }, 100);
    }

}
