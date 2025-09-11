import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { XRayRegistrationListComponent } from "./x-ray-registration-list.component";
describe("XRayRegistrationListComponent", () => {
  let component: XRayRegistrationListComponent;
  let fixture: ComponentFixture<XRayRegistrationListComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [XRayRegistrationListComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(XRayRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
