import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuantityListComponent } from './quantity-list.component';


describe('QuantityListComponent', () => {
  let component: QuantityListComponent;
  let fixture: ComponentFixture<QuantityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuantityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
