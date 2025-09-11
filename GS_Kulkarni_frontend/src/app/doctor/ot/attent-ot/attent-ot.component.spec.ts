import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttentOtComponent } from './attent-ot.component';

describe('AttentAppoinmentComponent', () => {
  let component: AttentOtComponent;
  let fixture: ComponentFixture<AttentOtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttentOtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttentOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
