import { Ringtone, RingtoneData } from "../interfaces/ringtones";

export class ringtone implements Ringtone{
    id: number;
    url: string;
    createdAt: Date;
    isPlaying: boolean;

    constructor(ringtoneData: RingtoneData){
        this.id = ringtoneData.ID;
        this.url = ringtoneData.Url;
        this.createdAt = new Date(ringtoneData.CreatedAt);
        this.isPlaying = false;
    }
}