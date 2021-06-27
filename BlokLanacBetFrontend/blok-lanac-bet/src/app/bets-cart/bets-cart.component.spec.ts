import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetsCartComponent } from './bets-cart.component';

describe('BetsCartComponent', () => {
  let component: BetsCartComponent;
  let fixture: ComponentFixture<BetsCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetsCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetsCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
