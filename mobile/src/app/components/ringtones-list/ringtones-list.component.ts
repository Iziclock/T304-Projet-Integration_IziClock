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
  ringtones: Ringtone[] = [];
  currentAudio: HTMLAudioElement | null = null;
  currentIndex: number | null = null;
  errorMessage: string = '';

  constructor(private ringtoneService: RingtoneService) { }

  getRingtones() {
    this.ringtoneService.getRingtones().subscribe((data: any) => {
      for (let ringtoneData of data) {
        const newRingtone: Ringtone = new ringtone(ringtoneData);
        newRingtone.isEditing = false; // Ajouter une propriété pour l'état de modification
        this.ringtones.push(newRingtone);
      }
    });
  }

  ngOnInit() {
    this.getRingtones();
  }

  toggleAudio(audio: HTMLAudioElement, index: number) {
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
      if (this.currentIndex !== null) {
        this.ringtones[this.currentIndex].isPlaying = false;
      }
    }

    if (this.ringtones[index].isPlaying) {
      audio.pause();
    } else {
      audio.play();
      this.currentAudio = audio;
      this.currentIndex = index;
    }

    this.ringtones[index].isPlaying = !this.ringtones[index].isPlaying;
  }

  updateRingtoneName(id: number) {
    const ringtone = this.ringtones.find(r => r.id === id);
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
}