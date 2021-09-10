import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalstorageService } from '../_services/local-storage/localstorage.service';
import { ScoresService } from '../_services/scores/scores.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  games: any[] = [];
  selectedDate = new Date('2021-06-20');

  constructor(
    private scoresService: ScoresService,
    private localStorageService: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.scoresService.getGamesForTheDay('2021-06-20').subscribe(
      (games) => {
        this.games = games;
      },
      (err) => {
        alert('Error fetching games!');
      }
    );
  }

  addBet(bet: any): void {
    this.localStorageService.addBet(bet);
  }

  onDateChange(date) {
    let dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    this.scoresService.getGamesForTheDay(dateStr).subscribe(
      (games) => {
        this.games = games;
      },
      (err) => {
        alert('Error fetching games!');
      }
    );
  }

  dateNext() {
    let dateStr = new Date(
      this.selectedDate.getTime() +
        3600 * 24 * 1000 -
        this.selectedDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];
    console.log(dateStr);

    this.selectedDate = new Date(dateStr);

    this.scoresService.getGamesForTheDay(dateStr).subscribe(
      (games) => {
        this.games = games;
      },
      (err) => {
        alert('Error fetching games!');
      }
    );
  }

  dateBack() {
    let dateStr = new Date(
      this.selectedDate.getTime() -
        3600 * 24 * 1000 -
        this.selectedDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0];
    console.log(dateStr);

    this.selectedDate = new Date(dateStr);

    this.scoresService.getGamesForTheDay(dateStr).subscribe(
      (games) => {
        this.games = games;
      },
      (err) => {
        alert('Error fetching games!');
      }
    );
  }
}
