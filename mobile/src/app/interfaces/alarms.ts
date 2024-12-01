export interface Alarm{
    id: number;
    calendarId: string;
    name: string;
    ringDate: Date;
    createdAt: Date;
    locationStart: string;
    locationEnd: string;
    ringtone: string;
    transport: string;
    active: boolean;
}

export interface AlarmData{
    ID: number;
    CalendarID: string;
    Name: string;
    Description: string;
    RingDate: string;
    CreatedAt: string;
    LocationStart: string;
    LocationEnd: string;
    Ringtone: string;
    Transport: string;
    IsActive: boolean;
}