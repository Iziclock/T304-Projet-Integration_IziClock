export interface Alarm{
    id: number;
    name: string;
    ringDate: Date;
    createdAt: Date;
    location: string;
    ringtone: string;
    active: boolean;
}

export interface AlarmData{
    ID: number;
    Name: string;
    RingDate: string;
    CreatedAt: string;
    Location: string;
    Ringtone: string;
    IsActive: boolean;
}