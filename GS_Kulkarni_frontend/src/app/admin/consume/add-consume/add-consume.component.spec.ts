import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsumeComponent } from './add-consume.component';

describe('AddConsumeComponent', () => {
  let component: AddConsumeComponent;
  let fixture: ComponentFixture<AddConsumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConsumeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddConsumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
