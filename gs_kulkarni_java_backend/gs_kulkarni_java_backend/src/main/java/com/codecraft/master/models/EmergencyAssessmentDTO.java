package com.codecraft.master.models;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyAssessmentDTO {
    private Integer id;

    private Integer patientId;
    private Integer appointmentId;
    private Integer doctorId;
    private Integer assessmentVitalId;

    private String consultant;
    private String broughtByVehicle;
    private String vehicleIdentity;
    private String preHospitalCare;
    private String preHospitalCareDetails;
    private String allergies;
    private String lastMealDetails;
    private String lastMealTime;
    private String medications;
    private String pastMedicalHistory;
    private String pastSergicalHistory;
    private String eventsLeadingToTrauma;
    private Integer painScore;
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