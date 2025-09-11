import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DosesListComponent } from './doses-list.component';


describe('DosesListComponent', () => {
  let component: DosesListComponent;
  let fixture: ComponentFixture<DosesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DosesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DosesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
