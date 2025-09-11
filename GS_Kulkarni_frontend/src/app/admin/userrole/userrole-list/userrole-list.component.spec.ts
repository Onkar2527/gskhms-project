import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRoleComponent } from './userrole-list.component';


describe('UserRoleListComponent', () => {
  let component: UserRoleComponent;
  let fixture: ComponentFixture<UserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
