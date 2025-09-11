import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCasesComponent } from './special-cases.component';

describe('SpecialCasesComponent', () => {
  let component: SpecialCasesComponent;
  let fixture: ComponentFixture<SpecialCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialCasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
