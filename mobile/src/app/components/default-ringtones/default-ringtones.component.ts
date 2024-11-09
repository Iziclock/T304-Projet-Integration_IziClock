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

  currentAudio: HTMLAudioElement | null = null;
  currentIndex: number | null = null;

  constructor() { }

  toggleAudio(audio: HTMLAudioElement, index: number) {
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
      if (this.currentIndex !== null) {
        this.defaultRingtones[this.currentIndex].isPlaying = false;
      }
    }

    if (this.defaultRingtones[index].isPlaying) {
      audio.pause();
    } else {
      audio.play();
      this.currentAudio = audio;
      this.currentIndex = index;
    }

    this.defaultRingtones[index].isPlaying = !this.defaultRingtones[index].isPlaying;
  }

  ngOnInit() { }
}