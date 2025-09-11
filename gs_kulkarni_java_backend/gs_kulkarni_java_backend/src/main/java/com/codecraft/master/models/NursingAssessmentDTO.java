package com.codecraft.master.models;


import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NursingAssessmentDTO {

    private Integer id;

    private Date assessmentDate;

    private Integer appointmentId;

    private Integer patientId;
    private Integer doctorId;
    private Integer nurseId;
    private Integer assessmentVitalId;
    private String arrivedBy;

    private Double height;

    private String bmi;

    private String levelOfConciousness;

    private String medicalPastHistory;

    private String surgicalPastHistory;

    private String bowelAssessment;

    private String bladderAssessment;

    private String historyOfAllergy;

    private String ifOnAnyMedication;

    private String pressureSore;

    private String pressureSoreLocation;

    private String pressureSoreAnyDeformities;

    private Integer dentures;
    private Integer contactLens;
    private Integer artificialLimbs;
    private Integer implants;

    private String onTubes;

    private Integer fistula;
    private Integer colostomy;
    private Integer nephrostomy;

    private String nutrition;
    private String otherDetails;
    private String riskOfFail;
    private String painScore;

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

    private String patientUHIDNumber;
    private String appointmentNumber;

    private List<AssessmentVitalDTO> assessmentVitalDTOList;

}