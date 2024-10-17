import { Calendar } from "../interfaces/calendars";

export class calendar implements Calendar{
    id: number;
    name: string;
    url: string;

    constructor(calendarData: Calendar){
        this.id = calendarData.id;
        this.name = calendarData.name;
        this.url = calendarData.url;
    }
}