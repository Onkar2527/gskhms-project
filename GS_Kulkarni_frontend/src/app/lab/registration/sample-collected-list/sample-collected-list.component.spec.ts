import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SampleCollectedListComponent } from "./sample-collected-list.component";

describe("SampleCollectedListComponent", () => {
  let component: SampleCollectedListComponent;
  let fixture: ComponentFixture<SampleCollectedListComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [SampleCollectedListComponent],
}).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(SampleCollectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
