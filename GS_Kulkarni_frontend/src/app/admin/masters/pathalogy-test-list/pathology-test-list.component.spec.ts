import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathologyTestListComponent } from './pathology-test-list.component';

describe('PathologyTestListComponent', () => {
  let component: PathologyTestListComponent;
  let fixture: ComponentFixture<PathologyTestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathologyTestListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PathologyTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
