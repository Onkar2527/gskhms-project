import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGTemplateComponent } from './add-note-gtemplate.component';

describe('AddGTemplateComponent', () => {
  let component: AddGTemplateComponent;
  let fixture: ComponentFixture<AddGTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
