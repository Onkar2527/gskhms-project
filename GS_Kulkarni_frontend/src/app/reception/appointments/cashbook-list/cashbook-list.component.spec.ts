import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbookListComponent } from './cashbook-list.component';

describe('CashbookListComponent', () => {
  let component: CashbookListComponent;
  let fixture: ComponentFixture<CashbookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashbookListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashbookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
