import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { EthereumService } from '../_services/eth/ethereum-service.service';
import { LocalstorageService } from '../_services/local-storage/localstorage.service';

@Component({
  selector: 'app-bets-cart',
  templateUrl: './bets-cart.component.html',
  styleUrls: ['./bets-cart.component.scss'],
})
export class BetsCartComponent implements OnInit {
  bets$: Observable<any> | undefined;
  totalQuota = 1;
  loading;
  bets;

  constructor(
    private storageMap: StorageMap,
    private fb: FormBuilder,
    private ethService: EthereumService,
    private snackBar: MatSnackBar,
    private localStorageService: LocalstorageService
  ) {}

  ngOnInit() {
    this.bets$ = this.storageMap.watch('bets');
    this.calculateTotalQuota();
  }

  calculateTotalQuota() {
    this.bets$?.subscribe(
      (bets) => {
        this.bets = bets;
        this.totalQuota = 1;
        bets.forEach((bet: any) => {
          this.totalQuota *= bet.quota;
        });
        this.totalQuota = Number(this.totalQuota.toFixed(2));
      },
      (error) => {}
    );
  }

  transactionForm: FormGroup = this.fb.group({
    amount: ['', Validators.required],
  });

  makeBet() {
    this.loading = true;

    this.ethService
      .placeBet(this.bets, this.transactionForm.get('amount')!.value)
      .then(
        (res) => {
          this.loading = undefined;
          this.snackBar.open(
            'You placed your bets successfully. Good Luck!',
            null,
            { duration: 3000 }
          );
          this.localStorageService.clearBets();
          this.ethService.connectAccount();
        },
        (err) => {
          this.loading = undefined;
          throw err;
        }
      );
  }
}
