import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGroupComponent } from './servicegroup-list.component';

describe('DesignationListComponent', () => {
  let component: ServiceGroupComponent;
  let fixture: ComponentFixture<ServiceGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
