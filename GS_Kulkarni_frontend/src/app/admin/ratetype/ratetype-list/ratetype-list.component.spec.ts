import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RateTypeListComponent } from './ratetype-list.component';


describe('PatientscategoryListComponent', () => {
  let component: RateTypeListComponent;
  let fixture: ComponentFixture<RateTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateTypeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
