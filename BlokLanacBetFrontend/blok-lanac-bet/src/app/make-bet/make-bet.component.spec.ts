import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeBetComponent } from './make-bet.component';

describe('MakeBetComponent', () => {
  let component: MakeBetComponent;
  let fixture: ComponentFixture<MakeBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeBetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
