export interface Alarm{
    id: number;
    calendarId: string;
    name: string;
    ringDate: Date;
    createdAt: Date;
    location: string;
    ringtone: string;
    active: boolean;
}

export interface AlarmData{
    ID: number;
    CalendarID: string;
    Name: string;
    Description: string;
    RingDate: string;
    CreatedAt: string;
    Location: string;
    Ringtone: string;
    IsActive: boolean;
}