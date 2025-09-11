import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPaymentReceiptComponent } from './print-payment-receipt.component';

describe('PrintPaymentReceiptComponent', () => {
  let component: PrintPaymentReceiptComponent;
  let fixture: ComponentFixture<PrintPaymentReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintPaymentReceiptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintPaymentReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
