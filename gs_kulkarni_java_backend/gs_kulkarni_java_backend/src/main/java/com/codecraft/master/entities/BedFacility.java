package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "bed_facility")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BedFacility extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Column(name = "bed_id")
    private Integer bedId;
    @Column(name = "bedsheet")
    private Integer bedsheet;
    @Column(name = "blanket")
    private Integer blanket;
    @Column(name = "pillow")
    private Integer pillow;
    @Column(name = "pillow_cover")
    private Integer pillowCover;
    @Column(name = "mattress")
    private Integer mattress;
    @Column(name = "rubber_sheet")
    private Integer rubberSheet;
    @Column(name = "kidney_tray")
    private Integer kidneyTray;
    @Column(name = "urine_tray")
    private Integer urineTray;
    @Column(name = "bed_pan")
    private Integer bedPan;

    @Column(name = "bedsheet_returned")
    private Integer bedsheetReturned;
    @Column(name = "blanket_returned")
    private Integer blanketReturned;
    @Column(name = "pillow_returned")
    private Integer pillowReturned;
    @Column(name = "pillow_cover_returned")
    private Integer pillowCoverReturned;
    @Column(name = "mattress_returned")
    private Integer mattressReturned;
    @Column(name = "rubber_sheet_returned")
    private Integer rubberSheetReturned;
    @Column(name = "kidney_tray_returned")
    private Integer kidneyTrayReturned;
    @Column(name = "urine_tray_returned")
    private Integer urineTrayReturned;
    @Column(name = "bed_pan_returned")
    private Integer bedPanReturned;

    @Column(name = "hospital_id")
    private Integer hospitalId;

}