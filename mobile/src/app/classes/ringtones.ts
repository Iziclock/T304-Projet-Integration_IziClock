import { Ringtone, RingtoneData } from "../interfaces/ringtones";

export class ringtone implements Ringtone{
    id: number;
    name: string;
    url: string;
    createdAt: Date;
    isPlaying: boolean;
    isEditing: boolean;

    constructor(ringtoneData: RingtoneData){
        this.id = ringtoneData.ID;
        this.name = ringtoneData.Name;
        this.url = ringtoneData.Url;
        this.createdAt = new Date(ringtoneData.CreatedAt);
        this.isPlaying = false;
        this.isEditing = false;
    }
}