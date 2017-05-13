import {JSWorksLib} from "jsworks/dist/dts/jsworks";
import {ITimetableDay} from "./ITimetable";
import {TimetableController} from "./TimetableController";


declare const JSWorks: JSWorksLib;


@JSWorks.Component({ view: 'TimetableView', controller: 'TimetableController' })
export class TimetableComponent {


    public _classes = [];
    public onRepeatClick: (component?: TimetableComponent) => void;
    public controller: TimetableController;


    @(<any> JSWorks.ComponentProperty())
    public loading: boolean = false;


    @(<any> JSWorks.ComponentProperty())
    public error: boolean = true;


    @(<any> JSWorks.ComponentCollectionProperty())
    public timetable: ITimetableDay[] = [
        {
            title: 'Caturday, 25 мая',
            classes: [
                {
                    title: 'Memology',
                    professor: 'Mr. Katz',
                    location: '806',
                    beginTime: new Date('2017-05-15T16:30:00'),
                    endTime: new Date('2017-05-15T18:00:00'),
                },
                {
                    title: 'МЗЯиОК',
                    professor: 'prof. Galina Ivanova',
                    location: '806ы',
                    beginTime: new Date('2017-05-15T18:15:00'),
                    endTime: new Date('2017-05-15T20:00:00'),
                }
            ]
        },
        {
            title: 'Sunday, 26 мая',
            classes: [
                {
                    title: 'МЗЯиОК',
                    professor: 'prof. Galina Ivanova',
                    location: '806ы',
                    beginTime: new Date('2017-05-15T18:15:00'),
                    endTime: new Date('2017-05-15T20:00:00'),
                }
            ]
        }
    ];


    public formatTime(beginTime: Date, endTime: Date): string {
        const format = (time: Date): string => {
            return `${time.getHours()}:${
                (time.getMinutes() < 10) ? ('0' + time.getMinutes()) : (time.getMinutes())
            }`;
        };

        return `${format(beginTime)} \u2014 ${format(endTime)}`;
    }


}