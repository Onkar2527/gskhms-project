import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyClinicalAssessmentListComponent } from './emergency-clinical-assessment-list.component';

describe('EmergencyClinicalAssessmentListComponent', () => {
  let component: EmergencyClinicalAssessmentListComponent;
  let fixture: ComponentFixture<EmergencyClinicalAssessmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyClinicalAssessmentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmergencyClinicalAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
