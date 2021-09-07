import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../_services/local-storage/localstorage.service';
import { ScoresService } from '../_services/scores/scores.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  games: any[] = [];

  constructor(
    private scoresService: ScoresService,
    private localStorageService: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.scoresService.getGames().subscribe(
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
}
