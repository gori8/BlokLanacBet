import { TestBed } from '@angular/core/testing';

import { EthereumServiceService } from './ethereum-service.service';

describe('EthereumServiceService', () => {
  let service: EthereumServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthereumServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
