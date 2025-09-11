import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialClinicalAssessmentComponent } from './initial-clinical-assessment.component';

describe('InitialClinicalAssessmentComponent', () => {
  let component: InitialClinicalAssessmentComponent;
  let fixture: ComponentFixture<InitialClinicalAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialClinicalAssessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitialClinicalAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
