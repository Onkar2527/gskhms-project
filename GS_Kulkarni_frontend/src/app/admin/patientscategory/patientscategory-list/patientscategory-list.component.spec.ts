import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientscategoryListComponent } from './patientscategory-list.component';


describe('PatientscategoryListComponent', () => {
  let component: PatientscategoryListComponent;
  let fixture: ComponentFixture<PatientscategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientscategoryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientscategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
