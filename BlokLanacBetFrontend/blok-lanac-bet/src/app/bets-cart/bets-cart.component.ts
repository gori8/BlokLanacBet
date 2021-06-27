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

  constructor(private storageMap: StorageMap) {}

  ngOnInit() {
    this.bets$ = this.storageMap.watch('bets');
  }
}
