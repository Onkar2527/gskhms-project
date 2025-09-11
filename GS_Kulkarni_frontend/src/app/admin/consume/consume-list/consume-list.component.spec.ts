import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsumeListComponent } from './consume-list.component';


describe('ConsumeListComponent', () => {
  let component: ConsumeListComponent;
  let fixture: ComponentFixture<ConsumeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
