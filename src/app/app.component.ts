import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { HeaderComponent } from "./Components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [TuiRoot, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CardCollectingFront';
}
//Aplikacja powstała na Wydziale Informatyki Politechniki Białostockiej