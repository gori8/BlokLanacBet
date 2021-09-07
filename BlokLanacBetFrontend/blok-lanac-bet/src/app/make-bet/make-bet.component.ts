import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageMap } from '@ngx-pwa/local-storage';
import { EthereumService } from '../_services/eth/ethereum-service.service';

@Component({
  selector: 'app-make-bet',
  templateUrl: './make-bet.component.html',
  styleUrls: ['./make-bet.component.scss'],
})
export class MakeBetComponent implements OnInit {
  transactionForm: FormGroup = this.fb.group({
    amount: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private ethService: EthereumService,
    private storageMap: StorageMap,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  makeBet() {
    let bets: [];
    this.storageMap.get('bets').subscribe(
      (res: any) => {
        bets = res;
        console.log(bets);
        this.ethService
          .makeBet(bets, this.transactionForm.get('amount')!.value)
          .then(
            (res) => {
              this.snackBar.open(
                'You placed your bets successfully. Good Luck!',
                null,
                { duration: 3000 }
              );
            },
            (err) => {
              throw err;
            }
          );
      },
      (error) => {}
    );
  }

  processBetResult() {
    this.ethService.processBetResult().then(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
