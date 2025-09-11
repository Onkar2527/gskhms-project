import { TestBed } from '@angular/core/testing';

import { InitialClinicalAssessmentService } from './initial-clinical-assessment.service';

describe('InitialClinicalAssessmentService', () => {
  let service: InitialClinicalAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialClinicalAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
