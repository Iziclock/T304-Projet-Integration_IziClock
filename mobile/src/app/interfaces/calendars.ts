export interface Calendar{
    id: number;
    userId: number;
    name: string;
    //url: string;
    idGoogle: string; //retiré et remplace l'ID
    description: string;
//    location: string;
    createdAt: Date;
    isActive: boolean;
}

export interface CalendarData{
    ID: number;
    UserID: number;
    Name: string;
    //Url: string;
    IDGoogle: string;
    Description: string;
//    Location: string;
    CreatedAt: string;
    IsActive: boolean;
}