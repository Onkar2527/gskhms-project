import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialClinicalAssessmentListComponent } from './initial-clinical-assessment-list.component';

describe('InitialClinicalAssessmentListComponent', () => {
  let component: InitialClinicalAssessmentListComponent;
  let fixture: ComponentFixture<InitialClinicalAssessmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialClinicalAssessmentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitialClinicalAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
