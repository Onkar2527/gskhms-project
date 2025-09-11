package com.codecraft.master.models;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class EmployeeDTO {

    private Integer employeeId;

    private String photo;
    private String firstName;
    private String middleName;
    private String lastName;

    private String emailId;
    private String password;
    private Integer hospitalId;

    private Date regTimestamp;

    private String userRegNumber;

    private String mobileNumber;

    private String altMobileNumber;

    private String gender;

    private String userType;

    private String status;

    private Date dob;

    private Date dateOfJoining;

    private Integer designationId;
    private String designationName;

    private String motherName;

    private String maritalStatus;

    private String bloodGroup;

    private String probationPeriod;

    private Date confirmationDate;

    private String uanNumber;

    private Integer specializationId;
    private String specializationName ;

    private String currentAddress;

    private String currentArea;

    private String currentTaluka;

    private String currentDistrict;

    private String currentState;

    private String currentPincode;

    private String permanantAddress;

    private String permanantArea;

    private String permanantTaluka;

    private String permanantDistrict;

    private String permanantState;

    private String permanantPincode;

    private String showAllHospitalData;

    private String adharNumber;

    private PayoutDetailsDTO payoutDetails;
}
