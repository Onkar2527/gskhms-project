import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMasterPharmacyComponent } from './add-master-pharmacy.component';

describe('AddMasterPharmacyComponent', () => {
  let component: AddMasterPharmacyComponent;
  let fixture: ComponentFixture<AddMasterPharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMasterPharmacyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMasterPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
