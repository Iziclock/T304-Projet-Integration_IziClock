import { Component, OnInit } from '@angular/core';
import { RingtoneService } from 'src/app/services/ringtone.service';
import { Ringtone } from 'src/app/interfaces/ringtones';
import { ringtone } from 'src/app/classes/ringtones';

@Component({
  selector: 'app-ringtones-list',
  templateUrl: './ringtones-list.component.html',
  styleUrls: ['./ringtones-list.component.scss'],
})
export class RingtonesListComponent implements OnInit {
  defaultRingtones: Ringtone[] = [];
  userRingtones: Ringtone[] = [];
  currentAudio: HTMLAudioElement | null = null;
  currentIndex: number | null = null;
  errorMessage: string = '';

  constructor(private ringtoneService: RingtoneService) { }

  getRingtones() {
    this.ringtoneService.getRingtones().subscribe((data: any) => {
      const ringtones: Ringtone[] = [];
      for (let ringtoneData of data) {
        const newRingtone: Ringtone = new ringtone(ringtoneData);
        newRingtone.isEditing = false; 
        newRingtone.isPlaying = false; 
        ringtones.push(newRingtone);
      }
      this.filterUserRingtones(ringtones);
      this.filterDefaultRingtones(ringtones);
    });
  }

  filterUserRingtones(ringtones: Ringtone[]) {
    this.userRingtones = ringtones.filter(ringtone => ringtone.id > 3);
  }

  filterDefaultRingtones(ringtones: Ringtone[]) {
    this.defaultRingtones = ringtones.filter(ringtone => ringtone.id < 4);
  }

  stopAllRingtones() {
    this.defaultRingtones.forEach(ringtone => ringtone.isPlaying = false);
    this.userRingtones.forEach(ringtone => ringtone.isPlaying = false);
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.currentIndex = null;
    }
  }

  toggleAudio(audio: HTMLAudioElement, index: number, isDefault: boolean) {
    if (this.currentAudio && this.currentAudio === audio) {
      if (audio.paused) {
        audio.play();
        if (isDefault) {
          this.defaultRingtones[index].isPlaying = true;
        } else {
          this.userRingtones[index].isPlaying = true;
        }
      } else {
        audio.pause();
        if (isDefault) {
          this.defaultRingtones[index].isPlaying = false;
        } else {
          this.userRingtones[index].isPlaying = false;
        }
      }
    } else {
      this.stopAllRingtones();

      this.currentAudio = audio;
      this.currentIndex = index;
      audio.play();
      if (isDefault) {
        this.defaultRingtones[index].isPlaying = true;
      } else {
        this.userRingtones[index].isPlaying = true;
      }
    }
  }

  updateRingtoneName(id: number) {
    const ringtone = this.userRingtones.find(r => r.id === id);
    if (ringtone) {
      if (ringtone.isEditing) {
        this.ringtoneService.updateRingtoneName(id, ringtone.name).subscribe({
          next: (response) => {
            console.log('Ringtone updated successfully', response);
          },
          error: (error) => {
            console.error('Error updating ringtone', error);
            this.errorMessage = 'Erreur : nom de sonnerie déjà pris';
          }
        });
      }
      ringtone.isEditing = !ringtone.isEditing;
    }
  }

  ngOnInit() {
    this.getRingtones();
  }

}