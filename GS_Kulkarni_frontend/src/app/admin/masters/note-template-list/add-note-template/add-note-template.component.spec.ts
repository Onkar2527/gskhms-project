import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNoteTemplateComponent } from './add-note-template.component';

describe('AddNoteTemplateComponent', () => {
  let component: AddNoteTemplateComponent;
  let fixture: ComponentFixture<AddNoteTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNoteTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNoteTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
