package com.codecraft.master.models;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MedicationOrderSheetDTO{

    private Integer id;

    private Date medicationDate;

    private Integer appointmentId;

    private Integer patientId;
    private Integer doctorId;
    private Integer nurseId;

    private String medication;

    private String dose;

    private String route;

    private String frequency;

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

    private Integer hospitalId;

}