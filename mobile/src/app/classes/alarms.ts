import { Alarm, AlarmData } from "../interfaces/alarms";

export class alarm implements Alarm{
    id: number;
    calendarId: string;
    name: string;
    description: string;
    ringDate: Date;
    preparationTime: number;
    createdAt: Date;
    locationStart: string;
    locationEnd: string;
    ringtone: string;
    transport: string;
    active: boolean;

    constructor(alarmData: AlarmData){
        this.id = alarmData.ID;
        this.calendarId = alarmData.CalendarID;
        this.name = alarmData.Name;
        this.description = alarmData.Description
        this.ringDate = new Date(alarmData.RingDate);
        this.preparationTime = alarmData.PreparationTime;
        this.createdAt = new Date(alarmData.CreatedAt);
        this.locationStart = alarmData.LocationStart;
        this.locationEnd = alarmData.LocationEnd;
        this.ringtone = alarmData.Ringtone;
        this.transport = alarmData.Transport;
        this.active = alarmData.IsActive;
    }
}