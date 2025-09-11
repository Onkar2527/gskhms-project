import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTokenComponentComponent } from './print-token-component.component';

describe('PrintTokenComponentComponent', () => {
  let component: PrintTokenComponentComponent;
  let fixture: ComponentFixture<PrintTokenComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintTokenComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintTokenComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
