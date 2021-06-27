import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor(private localStorage: LocalStorage) {}

  getBets(): Observable<any> {
    return this.localStorage.getItem('bets');
  }

  addBet(bet: any): void {
    this.getBets().subscribe((bets) => {
      if (bets == null) {
        bets = [];
      }
      bets.push(bet);
      this.localStorage.setItem('bets', bets).subscribe(
        () => {},
        (err) => {
          alert('Error adding bet!!!');
        }
      );
    });
  }
}
