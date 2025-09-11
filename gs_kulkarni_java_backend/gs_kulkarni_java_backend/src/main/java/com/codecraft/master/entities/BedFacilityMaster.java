package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "bed_facility_master")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BedFacilityMaster extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "bedsheet_price")
    private Double bedsheetPrice;
    @Column(name = "blanket_price")
    private Double blanketPrice;
    @Column(name = "pillow_price")
    private Double pillowPrice;
    @Column(name = "pillow_cover_price")
    private Double pillowCoverPrice;
    @Column(name = "mattress_price")
    private Double mattressPrice;
    @Column(name = "rubber_sheet_price")
    private Double rubberSheetPrice;
    @Column(name = "kidney_tray_price")
    private Double kidneyTrayPrice;
    @Column(name = "urine_tray_price")
    private Double urineTrayPrice;
    @Column(name = "bed_pan_price")
    private Double bedPanPrice;

    @Column(name = "hospital_id")
    private Integer hospitalId;

}