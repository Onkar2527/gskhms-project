import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SonographyRegistrationListComponent } from "./sonography-list.component";
describe("ViewappointmentComponent", () => {
  let component: SonographyRegistrationListComponent;
  let fixture: ComponentFixture<SonographyRegistrationListComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SonographyRegistrationListComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SonographyRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
