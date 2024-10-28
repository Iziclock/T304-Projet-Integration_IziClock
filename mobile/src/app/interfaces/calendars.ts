export interface Calendar{
    id: number;
    userId: number;
    name: string;
    url: string;
    createdAt: Date;
    isActive: boolean;
}

export interface CalendarData{
    ID: number;
    UserID: number;
    Name: string;
    Url: string;
    CreatedAt: string;
    IsActive: boolean;
}