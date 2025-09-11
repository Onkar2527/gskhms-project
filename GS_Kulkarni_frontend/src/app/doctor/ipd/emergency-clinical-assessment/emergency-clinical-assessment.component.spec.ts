import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyClinicalAssessmentComponent } from './emergency-clinical-assessment.component';

describe('EmergencyClinicalAssessmentComponent', () => {
  let component: EmergencyClinicalAssessmentComponent;
  let fixture: ComponentFixture<EmergencyClinicalAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyClinicalAssessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmergencyClinicalAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
