import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default-ringtones',
  templateUrl: './default-ringtones.component.html',
  styleUrls: ['./default-ringtones.component.scss'],
})
export class DefaultRingtonesComponent  implements OnInit {
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

  ngOnInit() {}

}