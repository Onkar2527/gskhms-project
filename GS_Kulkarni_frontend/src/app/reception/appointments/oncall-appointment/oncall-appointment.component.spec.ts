import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OncallAppointmentComponent } from './oncall-appointment.component';

describe('OncallAppointmentComponent', () => {
  let component: OncallAppointmentComponent;
  let fixture: ComponentFixture<OncallAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OncallAppointmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OncallAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
