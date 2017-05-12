

export interface ITimetableRecord {
    title: string;
    professor: string;
    location: string;
    beginTime: Date;
    endTime: Date;
}


export interface ITimetableDay {
    title: string
    classes: ITimetableRecord[];
}
