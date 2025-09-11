package com.codecraft.master.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {

	private Integer patientId;

	private Date regTimestamp;

	private String grnNumber;

	private String namePrefix;

	private String firstName;

	private String middleName;

	private String lastName;

	private String fatherName;

	private String motherName;

	private Date dob;

	private String gender;

	private String maritalStatus;

	private Integer occupationId;

	private String mobileNumber;

	private String altMobileNumber;

	private String email;

	private Integer pincode;

	private String state;

	private String district;

	private String taluka;

	private String area;

	private String address;

	private String bloodGroup;

	private Integer hospitalId;

	private Integer appointmentId;

	private String aadharNumber;

	private String PatientUHIDNumber;

	private String maidenName;
	private String husbandName;
	private String abhaNumber;
	private String priority;
	private String referredBy;
}