import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentAppoinmentComponent } from './attent-appoinment.component';

describe('AttentAppoinmentComponent', () => {
  let component: AttentAppoinmentComponent;
  let fixture: ComponentFixture<AttentAppoinmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttentAppoinmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttentAppoinmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
