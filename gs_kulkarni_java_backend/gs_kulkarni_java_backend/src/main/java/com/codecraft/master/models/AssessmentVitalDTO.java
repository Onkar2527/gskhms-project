package com.codecraft.master.models;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentVitalDTO {

	private Integer id;

	private Date measureTime;

	private Integer appointmentId;

	private String pulse;

	private String rr;

	private String bp;

	private String temperature;

	private String hr;

	private String spo2;

	private Integer hospitalId;

	private String abdGrith;

	private String weight;

	private String others;

	private String fhs;


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

}