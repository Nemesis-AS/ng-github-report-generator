import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IconService } from '../services/icon.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  username: string = "";

  constructor(_: IconService, private router: Router) {}

  viewProfile(e: Event) {
    e.preventDefault();
    console.log(this.username);

    this.router.navigate([`/profile`, this.username]);
  }
}
