import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default-ringtones',
  templateUrl: './default-ringtones.component.html',
  styleUrls: ['./default-ringtones.component.scss'],
})
export class DefaultRingtonesComponent implements OnInit {
  defaultRingtones: { name: string, src: string, isPlaying: boolean }[] = [
    { name: "Real Gone", src: "../../assets/ringtones/real-gone.mp3", isPlaying: false },
    { name: "Kalash", src: "../../assets/ringtones/kalash.mp3", isPlaying: false },
    { name: "Le Navire", src: "../../assets/ringtones/le-navire.mp3", isPlaying: false },
  ];

  constructor() { }

  toggleAudio(audio: HTMLAudioElement, index: number) {
    if (this.defaultRingtones[index].isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    this.defaultRingtones[index].isPlaying = !this.defaultRingtones[index].isPlaying;
  }

  ngOnInit() { }
}