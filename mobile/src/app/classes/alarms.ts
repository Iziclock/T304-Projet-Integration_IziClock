import { Alarm, AlarmData } from "../interfaces/alarms";

export class alarm implements Alarm{
    id: number;
    name: string;
    ringDate: Date;
    createdAt: Date;
    location: string;
    ringtone: string;
    active: boolean;

    constructor(alarmData: AlarmData){
        this.id = alarmData.ID;
        this.name = alarmData.Name;
        this.ringDate = new Date(alarmData.RingDate);
        this.createdAt = new Date(alarmData.CreatedAt);
        this.location = alarmData.Location;
        this.ringtone = alarmData.Ringtone;
        this.active = alarmData.IsActive;
    }
}