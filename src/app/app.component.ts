import { Component } from '@angular/core';
import { IconService } from './services/icon.service';

import { environment } from 'src/environments/environment';
import ms from "ms";

interface User {
  avatar_url: string | null;
  bio: string | null;
  company: string | null;
  email: string | null;
  followers: number;
  public_repos: number;
  name: string | null;
  location: string | null;
}

interface Repository {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'github-profile-viewer';

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

  constructor(private _: IconService) {
    this.fetchUserInfo();
  }

  private async fetchUserInfo() {
    const res = await fetch('https://api.github.com/users/Nemesis-AS', {
      headers: {
        Authorization: 'Bearer ' + environment.GITHUB_ACCESS_TOKEN,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const json = await res.json();
    this.user = json;

    const repoRes = await fetch(
      'https://api.github.com/users/Nemesis-AS/repos?sort=updated',
      {
        headers: {
          Authorization: 'Bearer ' + environment.GITHUB_ACCESS_TOKEN,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    const repoJson = await repoRes.json();
    console.log(repoJson);
    this.repos = repoJson;

    // Total Stars based on top 30 repos
    this.totalStars = this.repos
      .reduce((acc, curr) => acc + curr.stargazers_count, 0);

    // Total Forks based on top 30 repos
    this.totalForks = this.repos
      .reduce((acc, curr) => acc + curr.forks_count, 0);
  }

  formatTime(time: string): string {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    return `${ms(diff, { long: true })} ago`;
  }
}
