import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RecommendedOperationsComponent } from "./recommended-operations.component";

describe("RecommendedOperationsComponent", () => {
  let component: RecommendedOperationsComponent;
  let fixture: ComponentFixture<RecommendedOperationsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [RecommendedOperationsComponent],
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
