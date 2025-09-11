import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterPharmacyListComponent } from './master-pharmacy-list.component';


describe('MasterPharmacyListComponent', () => {
  let component: MasterPharmacyListComponent;
  let fixture: ComponentFixture<MasterPharmacyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterPharmacyListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterPharmacyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
