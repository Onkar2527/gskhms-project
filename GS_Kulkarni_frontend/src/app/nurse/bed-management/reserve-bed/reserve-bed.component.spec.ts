import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveBedComponent } from './reserve-bed.component';

describe('ReserveBedComponent', () => {
  let component: ReserveBedComponent;
  let fixture: ComponentFixture<ReserveBedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserveBedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReserveBedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
