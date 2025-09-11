import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DisPrescriptionComponent } from "./disprescription.component";

describe("DisPrescriptionComponent", () => {
  let component: DisPrescriptionComponent;
  let fixture: ComponentFixture<DisPrescriptionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [DisPrescriptionComponent],
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DisPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
