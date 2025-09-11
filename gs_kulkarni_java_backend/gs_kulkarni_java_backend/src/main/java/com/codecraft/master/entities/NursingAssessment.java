package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "nursing_assessment")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NursingAssessment extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "assessment_date")
    private Date assessmentDate;

    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Column(name = "patient_id")
    private Integer patientId;
    @Column(name = "doctor_id")
    private Integer doctorId;
    @Column(name = "nurse_id")
    private Integer nurseId;
    @Column(name = "assessment_vital_id")
    private Integer assessmentVitalId;
    @Column(name = "arrived_by")
    private String arrivedBy;

    @Column(name = "height")
    private Double height;

    @Column(name = "bmi")
    private String bmi;

    @Column(name = "level_of_conciousness")
    private String levelOfConciousness;

    @Column(name = "medical_past_history")
    private String medicalPastHistory;

    @Column(name = "surgical_past_history")
    private String surgicalPastHistory;

    @Column(name = "bowel_assessment")
    private String bowelAssessment;

    @Column(name = "bladder_assessment")
    private String bladderAssessment;

    @Column(name = "history_of_allergy")
    private String historyOfAllergy;

    @Column(name = "if_on_any_medication")
    private String ifOnAnyMedication;

    @Column(name = "pressure_sore")
    private String pressureSore;

    @Column(name = "pressure_sore_location")
    private String pressureSoreLocation;

    @Column(name = "pressure_sore_any_deformities")
    private String pressureSoreAnyDeformities;

    @Column(name = "dentures")
    private Integer dentures;
    @Column(name = "contact_lens")
    private Integer contactLens;
    @Column(name = "artificial_limbs")
    private Integer artificialLimbs;
    @Column(name = "implants")
    private Integer implants;

    @Column(name = "on_tubes")
    private String onTubes;

    @Column(name = "fistula")
    private Integer fistula;
    @Column(name = "colostomy")
    private Integer colostomy;
    @Column(name = "nephrostomy")
    private Integer nephrostomy;

    @Column(name = "nutrition")
    private String nutrition;
    @Column(name = "other_details")
    private String otherDetails;
    @Column(name = "risk_of_fail")
    private String riskOfFail;
    @Column(name = "pain_score")
    private String painScore;

    @Column(name = "hospital_id")
    private Integer hospitalId;

}