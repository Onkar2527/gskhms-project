package com.codecraft.master.models;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
	private Integer id;

	private Date createdTimestamp;

	private Date appointmentDate;

	private Date appointmentTime;

	private String appointmentNumber;

	private Integer patientId;

	private Integer deptId;

	private Integer sectionId;

	private Integer doctorId;
	private String doctorName;

	private Integer secDoctorId;
	private String secDoctorName;

	private Integer patientCatId;

	private Integer patientCompId;

	private Integer employeeId;

	private String status;

	private String healthcardNo;

	private String insurancePolicyNumber;

	private String referralHospital;

	private String referralDoctor;

	private String relativeName;

	private String relativeRelation;

	private String relativeContact;

	private String remark;

	private String type;

	private String mlcStatus;

	private String visitNo;

	private double grossAmount;

	private double discount;

	private double netAmount;

	private Integer hospitalId;

	private String mobileNumber;

	private String namePrefix;

	private String firstName;

	private String lastName;

	private String middleName;

	private String documentNumber;

	private Integer serviceId;

	private Double serviceAmount;

	private Date dob;

	private String gender;

	private String address;

	private String docType;

	private String subDocType;

	private String patientUHIDNumber;

	private Date lastModifiedDate;

	private String aadharNumber;

	private String instruction;

	private String otherService;//Y/N

	private String otherDescription;

	private Boolean operationRecommended;
	private String operationDetails;

	private Boolean admissionRecommended;
	private String admissionDetails;
	private Boolean dischargeStatus;
	private String dischargeNote;
	private Date dischargeDate;

	private Boolean isEmergency;
	private String paymentStatus;
	private Integer categoryId;
	private Integer organizationId;
	private Integer bedId;
	private String  createdBy;

	private String maidenName;
	private String husbandName;
	private String abhaNumber;
	private String fatherName;
	private String priority;

	private String age;
	private String referredBy;
}