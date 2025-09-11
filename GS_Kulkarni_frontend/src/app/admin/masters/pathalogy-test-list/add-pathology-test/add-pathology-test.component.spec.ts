import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPathologyTestComponent } from './add-pathology-test.component';

describe('AddPathologyTestComponent', () => {
  let component: AddPathologyTestComponent;
  let fixture: ComponentFixture<AddPathologyTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPathologyTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPathologyTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
