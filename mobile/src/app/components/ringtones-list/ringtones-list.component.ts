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

  constructor(private ringtoneService: RingtoneService) { }

  getRingtones() {
    this.ringtoneService.getRingtones().subscribe((data: any) => {
      for (let ringtoneData of data) {
        const newRingtone: Ringtone = new ringtone(ringtoneData);
        this.ringtones.push(newRingtone);
      }
    });
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

  ngOnInit() {
    this.getRingtones();
  }
}