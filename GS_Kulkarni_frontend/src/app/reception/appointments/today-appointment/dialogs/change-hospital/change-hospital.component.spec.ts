import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHospitalComponent } from './change-hospital.component';

describe('ChangeHospitalComponent', () => {
  let component: ChangeHospitalComponent;
  let fixture: ComponentFixture<ChangeHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeHospitalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
