import { Component, OnInit } from '@angular/core';
import { LocalStorage, StorageMap } from '@ngx-pwa/local-storage';
import { EthereumService } from '../_services/eth/ethereum-service.service';
import { LocalstorageService } from '../_services/local-storage/localstorage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public ethService: EthereumService,
    private localStoragaService: LocalstorageService
  ) {}

  ngOnInit(): void {}

  connectMetamaskAccount() {
    this.ethService.connectAccount().then(() => {
      this.localStoragaService.clearBets();
    });
  }
}
