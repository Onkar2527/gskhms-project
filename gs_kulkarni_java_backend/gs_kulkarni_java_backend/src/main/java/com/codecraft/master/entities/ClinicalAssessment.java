package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "clinical_assessment")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalAssessment extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "admission_date")
    private Date admissionDate;

    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Column(name = "patient_id")
    private Integer patientId;
    @Column(name = "doctor_id")
    private Integer doctorId;

    @Column(name = "assessment_vital_id")
    private Integer assessmentVitalId;

    @Column(name = "chielf_complaint")
    private String chiefComplaint;
    @Column(name = "present_illness_history")
    private String presentIllnessHistory;
    @Column(name = "past_history")
    private String pastHistory;
    @Column(name = "personal_history")
    private String personalHistory;
    @Column(name = "menstrual_history")
    private String menstrualHistory;
    @Column(name = "family_history")
    private String familyHistory;
    @Column(name = "past_treatment_history")
    private String pastTreatmentHistory;
    @Column(name = "nutritional_assessment")
    private String nutritionalAssessment;
    @Column(name = "general_examination_built")
    private String generalExaminationBuilt;
    @Column(name = "general_examination_pallor")
    private String generalExamination_Pallor;
    @Column(name = "general_examination_jvp")
    private String generalExaminationJVP;
    @Column(name = "se_rs")
    private String seRS;
    @Column(name = "se_cvs")
    private String seCVS;
    @Column(name = "systematic_examination_findings")
    private String systematicExaminationFindings;
    @Column(name = "se_abdomen")
    private String seAbdomen;
    @Column(name = "se_cns")
    private String seCNS;
    @Column(name = "se_musculoskeletal_system")
    private String seMusculoskeletalSystem;
    @Column(name = "se_genitalia")
    private String seGenitalia;
    @Column(name = "local_examination")
    private String localExamination;
    @Column(name = "provisional_diagnosis")
    private String provisionalDiagnosis;
    @Column(name = "final_diagnosis")
    private String finalDiagnosis;
    @Column(name = "plan_of_care")
    private String planOfCare;

    @Column(name = "desiredOutcome")
    private String desiredOutcome;

    @Column(name = "hospital_id")
    private Integer hospitalId;

    @Column(name = "admit_status")
    private String admitStatus;
}