import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCasePaperComponent } from './print-case-paper.component';

describe('PrintCasePaperComponent', () => {
  let component: PrintCasePaperComponent;
  let fixture: ComponentFixture<PrintCasePaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintCasePaperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintCasePaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
