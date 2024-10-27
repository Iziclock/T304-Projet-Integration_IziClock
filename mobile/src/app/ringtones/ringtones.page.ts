import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ringtones',
  templateUrl: './ringtones.page.html',
  styleUrls: ['./ringtones.page.scss'],
})
export class RingtonesPage implements OnInit {
  isPlaying = false;

  constructor() { }

  toggleAudio(audio: HTMLAudioElement) {
    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  ngOnInit() {
  }
}
