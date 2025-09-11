import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SonographyListComponent } from './sonography.component';

describe('SonographyListComponent', () => {
  let component: SonographyListComponent;
  let fixture: ComponentFixture<SonographyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SonographyListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SonographyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
