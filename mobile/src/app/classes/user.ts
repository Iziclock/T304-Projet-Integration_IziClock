import { User, UserData } from "../interfaces/users";

export class user implements User {
  id: number;
  name: string;
  prepTime: number;
  ringtone: number;
  createdAt: Date;

  constructor(userData: UserData) {
    this.id = userData.ID;
    this.name = userData.Name;
    this.prepTime = userData.PreparationTime;
    this.ringtone = userData.RingtoneID;
    this.createdAt = new Date(userData.CreatedAt);
  }
}