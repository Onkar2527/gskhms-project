import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SonographyComponent } from './add_test.component';

describe('SonographyComponent', () => {
  let component: SonographyComponent;
  let fixture: ComponentFixture<SonographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SonographyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SonographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
