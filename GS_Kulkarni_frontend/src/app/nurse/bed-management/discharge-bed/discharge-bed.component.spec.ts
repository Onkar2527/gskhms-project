import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeBedComponent } from './discharge-bed.component';

describe('DischargeBedComponent', () => {
  let component: DischargeBedComponent;
  let fixture: ComponentFixture<DischargeBedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DischargeBedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DischargeBedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
