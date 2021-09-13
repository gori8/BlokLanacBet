import { verifyHostBindings } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { BetsService } from '../_services/bets/bets.service';
import { EthereumService } from '../_services/eth/ethereum-service.service';

@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.scss'],
})
export class BetHistoryComponent implements OnInit {
  bets = [];

  constructor(
    private betsService: BetsService,
    private ethService: EthereumService
  ) {}

  ngOnInit(): void {
    console.log(this.ethService.currentAccount);
    this.betsService
      .getAllUserBets(this.ethService.currentAccount)
      .toPromise()
      .then(
        (res) => {
          console.log('BET HISTORY BETS: ', res);
          this.bets = res;
          this.calculateTotalQuota();
          this.bets = this.reverseArray(this.bets);
        },
        (err) => {}
      );
    this.ethService.accountStatus$.subscribe(
      (res) => {
        this.betsService
          .getAllUserBets(res)
          .toPromise()
          .then(
            (res) => {
              console.log('BET HISTORY BETS: ', res);
              this.bets = res;
              this.calculateTotalQuota();
              this.bets = this.reverseArray(this.bets);
            },
            (err) => {}
          );
      },
      (err) => {}
    );
  }

  calculateTotalQuota() {
    this.bets.forEach((bet) => {
      bet['totalQuota'] = 1;
      bet.bet.forEach((singleBet: any) => {
        bet['totalQuota'] *= singleBet.quota;
      });
      bet['totalQuota'] = Number(bet['totalQuota'].toFixed(2));
      if (bet.status == 0) {
        bet.statusText = 'Pending';
      } else if (bet.status == 1) {
        bet.statusText = 'Lost';
      } else if (bet.status == 2) {
        bet.statusText = 'Won';
      }
    });
  }

  reverseArray(arr) {
    if (arr.length === 0) {
      return [];
    }
    return [arr.pop()].concat(this.reverseArray(arr));
  }
}
