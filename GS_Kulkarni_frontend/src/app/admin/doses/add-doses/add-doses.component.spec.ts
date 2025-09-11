import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDosesComponent } from './add-doses.component';

describe('AddDosesComponent', () => {
  let component: AddDosesComponent;
  let fixture: ComponentFixture<AddDosesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDosesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDosesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
