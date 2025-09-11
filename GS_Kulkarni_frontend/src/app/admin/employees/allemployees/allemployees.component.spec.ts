import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AllEmployeesComponent } from "./allemployees.component";
describe("AllEmployeesComponent", () => {
  let component: AllEmployeesComponent;
  let fixture: ComponentFixture<AllEmployeesComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [AllEmployeesComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
