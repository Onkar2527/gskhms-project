import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLabelComponentComponent } from './print-label-component.component';

describe('PrintLabelComponentComponent', () => {
  let component: PrintLabelComponentComponent;
  let fixture: ComponentFixture<PrintLabelComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintLabelComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintLabelComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
