import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageMasterListComponent } from './package-master-list.component';

describe('PackageMasterListComponent', () => {
  let component: PackageMasterListComponent;
  let fixture: ComponentFixture<PackageMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageMasterListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
