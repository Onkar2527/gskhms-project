import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientcompanyComponent } from './patientcompany-list.component';


describe('PatientscategoryListComponent', () => {
  let component: PatientcompanyComponent;
  let fixture: ComponentFixture<PatientcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientcompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
