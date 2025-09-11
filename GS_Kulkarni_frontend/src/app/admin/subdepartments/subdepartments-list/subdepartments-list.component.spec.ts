import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdepartmentsListComponent } from './subdepartments-list.component';

describe('DesignationListComponent', () => {
  let component: SubdepartmentsListComponent;
  let fixture: ComponentFixture<SubdepartmentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubdepartmentsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubdepartmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
