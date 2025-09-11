import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RecommendedAdmissionsComponent } from "./recommended-admissions.component";

describe("RecommendedAdmissionsComponent", () => {
  let component: RecommendedAdmissionsComponent;
  let fixture: ComponentFixture<RecommendedAdmissionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RecommendedAdmissionsComponent],
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedAdmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
