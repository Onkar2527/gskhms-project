import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddXrayComponent } from './add-xray.component';

describe('AddXrayComponent', () => {
  let component: AddXrayComponent;
  let fixture: ComponentFixture<AddXrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddXrayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddXrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
