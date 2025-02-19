import { Component } from '@angular/core';
import { IconService } from '../services/icon.service';

import { environment } from 'src/environments/environment';
import ms from "ms";

import type User from '../types/User.type';
import type Repository from '../types/Repository.type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user: User = {
    avatar_url: null,
    bio: null,
    company: null,
    email: null,
    followers: 0,
    public_repos: 0,
    name: null,
    location: null,
  };
  repos: Repository[] = [];
  totalStars: number = 0;
  totalForks: number = 0;

  constructor(private _: IconService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const username = params.get('id') || '';

      if (!username)
        return;

      this.fetchUserInfo(username)
    });
  }

  private async fetchUserInfo(username: string) {
    try {
      if (!username)
        return;

      const res = await fetch(environment.BACKEND_ROUTE_URL + "?username=" + username);
      if (res.status !== 200)
        throw new Error("Request failed!");

      const json = await res.json();

      this.user = json.profile;
      this.repos = json.repos;

      // Total Stars based on top 30 repos
      this.totalStars = this.repos.reduce(
        (acc, curr) => acc + curr.stargazers_count,
        0
      );

      // Total Forks based on top 30 repos
      this.totalForks = this.repos.reduce(
        (acc, curr) => acc + curr.forks_count,
        0
      );
    } catch(err) {
      console.error("An error occurred while fetching the user info!");
    }
  }

  formatTime(time: string): string {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    return `${ms(diff, { long: true })} ago`;
  }
}
