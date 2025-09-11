import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintOperationSummary } from './print-discharge-summary.component';

describe('PrintOperationSummary', () => {
  let component: PrintOperationSummary;
  let fixture: ComponentFixture<PrintOperationSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintOperationSummary]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintOperationSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
