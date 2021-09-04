import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { EthereumService } from '../_services/eth/ethereum-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public ethService: EthereumService,
    private storageMap: StorageMap
  ) {}

  ngOnInit(): void {}

  connectMetamaskAccount() {
    this.ethService.connectAccount().then(() => {
      this.storageMap.clear().subscribe({
        next: () => {},
        error: (error) => {},
      });
    });
  }
}
