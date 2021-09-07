import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { LocalstorageService } from '../_services/local-storage/localstorage.service';

@Component({
  selector: 'app-bets-cart',
  templateUrl: './bets-cart.component.html',
  styleUrls: ['./bets-cart.component.scss'],
})
export class BetsCartComponent implements OnInit {
  bets$: Observable<any> | undefined;
  totalQuota = 1;

  constructor(private storageMap: StorageMap) {}

  ngOnInit() {
    this.bets$ = this.storageMap.watch('bets');
    this.calculateTotalQuota();
  }

  calculateTotalQuota() {
    this.bets$?.subscribe(
      (bets) => {
        this.totalQuota = 1;
        bets.forEach((bet: any) => {
          this.totalQuota *= bet.quota;
        });
        this.totalQuota = Number(this.totalQuota.toFixed(2));
      },
      (error) => {}
    );
  }
}
