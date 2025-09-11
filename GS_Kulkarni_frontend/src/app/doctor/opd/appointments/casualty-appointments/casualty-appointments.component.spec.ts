import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasualtyAppointmentsComponent } from './casualty-appointments.component';

describe('CasualtyAppointmentsComponent', () => {
  let component: CasualtyAppointmentsComponent;
  let fixture: ComponentFixture<CasualtyAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasualtyAppointmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CasualtyAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
