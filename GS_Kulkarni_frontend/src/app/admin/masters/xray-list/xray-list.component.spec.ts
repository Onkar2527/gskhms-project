import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XrayListComponent } from './xray-list.component';

describe('XrayListComponent', () => {
  let component: XrayListComponent;
  let fixture: ComponentFixture<XrayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XrayListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(XrayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
