import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
     RouterOutlet,
     RouterLink,
     RouterLinkActive
    ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
}
