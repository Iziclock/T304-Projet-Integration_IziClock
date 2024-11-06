import { Calendar, CalendarData } from "../interfaces/calendars";

export class calendar implements Calendar{
    id: number;
    userId: number;
    name: string;
    //url: string;
    idGoogle: string;
    //description: string;
 //   location: string;
    //createdAt: Date;
    isActive: boolean;

    constructor(calendarData: CalendarData){
        this.id = calendarData.ID;
        this.userId = calendarData.UserID;
        this.name = calendarData.Name;
        //this.url = calendarData.Url;
        this.idGoogle = calendarData.IDGoogle
        //this.description = calendarData.Description;
//      this.location = calendarData.Location;
        //this.createdAt = new Date(calendarData.CreatedAt);
        this.isActive = calendarData.IsActive;
    }

}