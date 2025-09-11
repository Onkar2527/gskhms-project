package com.codecraft.master.models;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OTRegistrationDTO {
    private Integer id;

    private Integer patientId;

    private Integer appointmentId;

    private Integer otMasterId;
    private String operationTypeName;

    private Date inDate;

    private Date outDate;

    private String anaesthesiaInducedBy;

    private String operatingSurgeons;

    private String implantsUsed;

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
    private String address;
    private  String aadharNumber;

    private String patientUHIDNumber;
    private String appointmentNumber;


}