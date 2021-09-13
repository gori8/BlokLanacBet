import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
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
  bets$: Observable<any> | undefined;
  addedGames = new Map();

  constructor(
    private scoresService: ScoresService,
    private localStorageService: LocalstorageService,
    private storageMap: StorageMap
  ) {}

  ngOnInit(): void {
    this.bets$ = this.storageMap.watch('bets');
    this.scoresService.getGamesForTheDay('2021-06-20').subscribe(
      (games) => {
        this.games = games;
      },
      (err) => {
        alert('Error fetching games!');
      }
    );
    this.calculateAddedGames();
  }

  calculateAddedGames() {
    this.bets$?.subscribe(
      (bets) => {
        if (bets === undefined || bets.length == 0) {
          this.addedGames = new Map();
        }
        bets.forEach((bet: any) => {
          this.addedGames.set(bet.gameId, bet.betOn);
        });
      },
      (error) => {}
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
