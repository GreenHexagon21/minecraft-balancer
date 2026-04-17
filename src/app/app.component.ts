import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AppComponent {
  title = 'minecraft-balancer';

  private readonly clickAudio = new Audio('/assets/sounds/click.wav');
  private readonly tickAudio = new Audio('/assets/sounds/pop2.wav');
  private readonly popAudio = new Audio('/assets/sounds/pop.wav');

  constructor() {
    this.clickAudio.preload = 'auto';
    this.tickAudio.preload = 'auto';
    this.popAudio.preload = 'auto';
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Element | null;

    const link = target?.closest('a');
    if (link) {
      this.play(this.popAudio);
      return;
    }

    const button = target?.closest('button');
    if (button) {
      this.play(this.clickAudio);
      return;
    }
    this.play(this.tickAudio);
  }

  private play(audio: HTMLAudioElement): void {
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error('Audio playback failed:', err);
    });
  }
}
