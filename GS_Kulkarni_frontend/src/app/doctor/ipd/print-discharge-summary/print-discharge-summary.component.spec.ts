import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintDischargeSummary } from './print-discharge-summary.component';


describe('PrintDischargeSummary', () => {
  let component: PrintDischargeSummary;
  let fixture: ComponentFixture<PrintDischargeSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintDischargeSummary]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintDischargeSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
