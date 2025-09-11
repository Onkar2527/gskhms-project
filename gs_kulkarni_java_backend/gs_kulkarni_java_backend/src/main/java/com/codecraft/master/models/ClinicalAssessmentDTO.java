package com.codecraft.master.models;

import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalAssessmentDTO {

    private Integer id;

    private Date admissionDate;

    private Integer appointmentId;

    private Integer patientId;
    private Integer doctorId;
    private Integer assessmentVitalId;

    private String chiefComplaint;
    private String presentIllnessHistory;
    private String pastHistory;
    private String personalHistory;
    private String menstrualHistory;
    private String familyHistory;
    private String pastTreatmentHistory;
    private String nutritionalAssessment;
    private String generalExaminationBuilt;
    private String generalExamination_Pallor;
    private String generalExaminationJVP;
    private String seRS;
    private String seCVS;
    private String systematicExaminationFindings;
    private String seAbdomen;
    private String seCNS;
    private String seMusculoskeletalSystem;
    private String seGenitalia;
    private String localExamination;
    private String provisionalDiagnosis;
    private String finalDiagnosis;
    private String planOfCare;

    private String desiredOutcome;

    private Integer hospitalId;

    private String namePrefix;
    private String firstName;
    private String middleName;
    private String lastName;
    private String fatherName;
    private Date dob;
    private String gender;
    private String maritalStatus;
    private String mobileNumber;
    private PatientDTO patientDetails;
    private String patientUHIDNumber;
    private String appointmentNumber;
    private String admitStatus;

    private List<AssessmentVitalDTO> assessmentVitalDTOList;

}