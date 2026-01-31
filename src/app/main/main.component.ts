import { Component } from '@angular/core';
import { HeaderComponent } from "../parts/header/header.component";
import { RouterOutlet } from "@angular/router";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { appConfig } from '../app.config';
bootstrapApplication(AppComponent, appConfig);
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
