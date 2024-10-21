import { Calendar, CalendarData } from "../interfaces/calendars";

export class calendar implements Calendar{
    id: number;
    userId: number;
    name: string;
    url: string;
    createdAt: Date;
    isActive: boolean;

    constructor(calendarData: CalendarData){
        this.id = calendarData.ID;
        this.userId = calendarData.UserID;
        this.name = calendarData.Name;
        this.url = calendarData.Url;
        this.createdAt = new Date(calendarData.CreatedAt);
        this.isActive = calendarData.IsActive;
    }

}