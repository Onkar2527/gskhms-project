import { Route } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { AddUnitComponent } from "./unit-list/add-unit/add-unit.component";
import { UnitListComponent } from "./unit-list/unit-list.component";
import { PathologyTestListComponent } from "./pathalogy-test-list/pathology-test-list.component";
import { AddPathologyTestComponent } from "./pathalogy-test-list/add-pathology-test/add-pathology-test.component";

import { AddXrayComponent } from "./xray-list/add-xray/add-xray.component";
import { PackageMasterListComponent } from "./package-master-list/package-master-list.component";
import { AddPackageMasterComponent } from "./package-master-list/add-package-master/add-package-master.component";
import { TemplateListComponent } from "./template-list/template-list.component";
import { AddMasterPharmacyComponent } from "./master-pharmacy/add-master-pharmacy/add-master-pharmacy.component";
import { MasterPharmacyListComponent } from "./master-pharmacy/master-pharmacy-list/master-pharmacy-list.component";
import { AddTemplateComponent } from "./template-list/add-template/add-template.component";
import { NoteTemplateListComponent } from "./note-template-list/note-template-list.component";
import { AddNoteTemplateComponent } from "./note-template-list/add-note-template/add-note-template.component";
import { XrayListComponent } from "./xray-list/xray-list.component";
import { AddFloorComponent } from "./floor-list/add-floor/add-floor.component";
import { FloorListComponent } from "./floor-list/floor-list.component";
import { BillingClassListComponent } from "./billing-class-list/billing-class-list.component";
import { AddBillingClassComponent } from "./billing-class-list/add-billing-class/add-billing-class.component";
import { RoomTypeListComponent } from "./room-type-list/room-type-list.component";
import { AddRoomTypeComponent } from "./room-type-list/add-room-type/add-room-type.component";
import { AddBedComponent } from "./bed-list/add-bed/add-bed.component";
import { BedListComponent } from "./bed-list/bed-list.component";
import { AddRoomComponent } from "./room-list/add-room/add-room.component";
import { RoomListComponent } from "./room-list/room-list.component";
import { AddOperationTypeComponent } from "./operation-type-list/add-operation-type/add-operation-type.component";
import { OperationTypeListComponent } from "./operation-type-list/operation-type-list.component";
import { AddAnesthesiaTypeComponent } from "./anesthesia-type-list/add-anesthesia-type/add-anesthesia-type.component";
import { AnesthesiaTypeListComponent } from "./anesthesia-type-list/anesthesia-type-list.component";
import { gynecologycomponent } from "./gynecology_list/gynecology_list.component";
import { AddGTemplateComponent } from "./gynecology_list/add-note-gtemplate/add-note-gtemplate.component";
import { SonographyListComponent } from "./sonography_test/sonography.component";
import { SonographyComponent } from "./sonography_test/add_test/add_test.component";




export const MASTER_ROUTE: Route[] = [
    {
      path: "add-unit",
      component: AddUnitComponent,
    },{
      path: "unit-list",
    component: UnitListComponent,
    },{
      path: "add-room-type",
      component: AddRoomTypeComponent,
    },{
      path: "room-type-list",
    component: RoomTypeListComponent,
    },{
      path: "add-bed",
      component: AddBedComponent,
    },{
      path: "bed-list",
    component: BedListComponent,
    },{
      path: "add-room",
      component: AddRoomComponent,
    },{
      path: "room-list",
    component: RoomListComponent,
    },{
      path: "add-floor",
      component: AddFloorComponent,
    },{
      path: "add-billing-class",
      component: AddBillingClassComponent,
    },{
      path: "floor-list",
    component: FloorListComponent,
    },{
      path: "billing-class-list",
    component: BillingClassListComponent,
    },{
      path: "add-template",
      component: AddTemplateComponent,
    },{
      path: "template-list",
    component: TemplateListComponent,
    },{
      path: "add-operation-type",
      component: AddOperationTypeComponent,
    },{
      path: "anesthesia-type-list",
    component: AnesthesiaTypeListComponent,
    },{
      path: "add-anesthesia-type",
      component: AddAnesthesiaTypeComponent,
    },{
      path: "operation-type-list",
    component: OperationTypeListComponent,
    },
    {
      path: "pathology-test-list",
    component: PathologyTestListComponent,
    },
    {
      path: "add-pathology-test",
      component: AddPathologyTestComponent,
    },
    {
      path: "x-ray-list",
    component: XrayListComponent,
    },
    {
      path: "add-x-ray",
      component: AddXrayComponent,
    },
    {
      path: "sonography-list",
    component: SonographyListComponent,
    },
    {
      path: "add-sonography",
      component: SonographyComponent,
    },
    {
      path: "package-master-list",
    component: PackageMasterListComponent,
    },
   {
      path: "add-package-master",
      component: AddPackageMasterComponent,
    },
    {
      path: "add-pharmacy",
      component: AddMasterPharmacyComponent,
    },
    {
      path: "pharmacy-list",
    component: MasterPharmacyListComponent,
    },{
      path: "add-note-template",
      component: AddNoteTemplateComponent,
    },
    {
      path: "note-template-list",
    component: NoteTemplateListComponent,
    },
    {
      path: "add-note-gtemplate",
    component: AddGTemplateComponent,
    },
    {
      path:"gynecology-notes-template",
    component: gynecologycomponent,
   },
    { path: "**", component: Page404Component },
  ];