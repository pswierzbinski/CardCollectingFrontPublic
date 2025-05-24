import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiHint } from '@taiga-ui/core';
import { TuiCarousel } from '@taiga-ui/kit';

@Component({
    selector: 'app-home',
    imports: [TuiHint, NgFor, TuiCarousel],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './home.component.html',
    styleUrl: './home.component.less'
})

export class HomeComponent {
  protected index = 1;
  protected readonly cardNames: string[] = [
    "",
    "Fear of the Dark.png",
    "Jevyan's Advice.png",
    "Erode.png",
    "Dragon Cliffs.png",
    "Plated Lizard.png",
    "Early Spring.png",
    "",
  ]
  openLink(){
    window.open("https://arcmage.org/", "_blank");
  }
  }
