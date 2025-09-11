package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "nursing_notes")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NursingNotes extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "note_date")
    private Date notesDate;

    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Column(name = "patient_id")
    private Integer patientId;
    @Column(name = "doctor_id")
    private Integer doctorId;
    @Column(name = "nurse_id")
    private Integer nurseId;

    @Column(name = "personal_hygiene")
    private String personalHygiene;


    @Column(name = "mlc_details")
    private String mlcDetails;


    @Column(name = "bed_sore_status")
    private String bedSoreStatus;


    @Column(name = "position_advised")
    private String positionAdvised;

    @Column(name = "investigation_done")
    private String investigationDone;

    @Column(name = "general_condition")
    private String generalCondition;

    @Column(name = "trp_bp")
    private String trpBP;

    @Column(name = "io_chart_generated")
    private String ioChartGenerated;

    @Column(name = "medication_administration")
    private String medicationAdministration;

    @Column(name = "due_drug")
    private String dueDrug;

    @Column(name = "not_administrated_medicines")
    private String notAdministratedMedicines;

    @Column(name = "bsl_chart")
    private String bslChart;
    @Column(name = "clean_dressing")
    private String cleanDressing;
    @Column(name = "infected_dressing")
    private String infectedDressings;
    @Column(name = "vac_dressing")
    private String vacDressings;
    @Column(name = "grafting_dressing")
    private String graftingDressings;
    @Column(name = "plaster")
    private String plaster;

    @Column(name = "physiotherapy")
    private String physiotherapy;
    @Column(name = "traction")
    private String traction;
    @Column(name = "nebulization")
    private String nebulization;
    @Column(name = "diet_advised")
    private String dietAdvised;
    @Column(name = "blood_product_advised")
    private String bloodProductAdvised;
    @Column(name = "poil_checked")
    private String poilChecked;
    @Column(name = "surgery_advised")
    private String surgeryAdvised;

    @Column(name = "nbm")
    private String nbm;
    @Column(name = "pre_operative_checklist")
    private String preOperativeChecklist;
    @Column(name = "consents")
    private String consents;
    @Column(name = "catheter_care")
    private String catheterCare;
    @Column(name = "central_line_care")
    private String centralLineCare;
    @Column(name = "patient_Critical")
    private String patientCritical;

    @Column(name = "high_risk_content")
    private String hishRiskContent;
    @Column(name = "pt_complaint_informed")
    private String ptComplaintsInformed;
    @Column(name = "motion_pass")
    private String motionPass;
    @Column(name = "no_dues")
    private String noDues;
    @Column(name = "discharge_process")
    private String dischargeProcess;
    @Column(name = "dama_consent")
    private String damaConsent;
    @Column(name = "hand_over_done")
    private String handOverDone;

    @Column(name = "hospital_id")
    private Integer hospitalId;

}