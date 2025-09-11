import { ComponentFixture, TestBed } from '@angular/core/testing';

import { gynecologycomponent } from './gynecology_list.component';

describe('TemplateListComponent', () => {
  let component: gynecologycomponent;
  let fixture: ComponentFixture<gynecologycomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [gynecologycomponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(gynecologycomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
