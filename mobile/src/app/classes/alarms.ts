import { Alarm, AlarmData } from "../interfaces/alarms";

export class alarm implements Alarm{
    id: number;
    calendarId: string;
    name: string;
    description: string;
    ringDate: Date;
    createdAt: Date;
    location: string;
    ringtone: string;
    active: boolean;

    constructor(alarmData: AlarmData){
        this.id = alarmData.ID;
        this.calendarId = alarmData.CalendarID;
        this.name = alarmData.Name;
        this.description = alarmData.Description
        this.ringDate = new Date(alarmData.RingDate);
        this.createdAt = new Date(alarmData.CreatedAt);
        this.location = alarmData.Location;
        this.ringtone = alarmData.Ringtone;
        this.active = alarmData.IsActive;
    }
}