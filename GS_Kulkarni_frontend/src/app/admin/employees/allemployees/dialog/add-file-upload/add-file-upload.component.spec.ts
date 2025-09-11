import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFileUploadComponent } from './add-file-upload.component';

describe('AddFileUploadComponent', () => {
  let component: AddFileUploadComponent;
  let fixture: ComponentFixture<AddFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFileUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
