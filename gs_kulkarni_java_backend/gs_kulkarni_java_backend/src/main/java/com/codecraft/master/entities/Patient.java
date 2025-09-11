package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="patient")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Patient  extends Auditable {
	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer patientId;

	@Column(name= "reg_date")
	private Date regTimestamp;

	@Column(name= "grn")
	private String grnNumber;

	@Column(name= "name_prefix")
	private String namePrefix;

	@Column(name= "first_name")
	private String firstName;

	@Column(name= "middle_name")
	private String middleName;

	@Column(name= "last_name")
	private String lastName;

	@Column(name= "father_name")
	private String fatherName;

	@Column(name= "mother_name")
	private String motherName;

	@Column(name= "dob")
	private Date dob;

	@Column(name= "gender")
	private String gender;

	@Column(name= "marital_status")
	private String maritalStatus;

	@Column(name= "occupation_id")
	private Integer occupationId;

	@Column(name= "mobile_number")
	private String mobileNumber;

	@Column(name= "alt_mobile_number")
	private String altMobileNumber;

	@Column(name= "email")
	private String email;

	@Column(name= "pincode")
	private Integer pincode;

	@Column(name= "state")
	private String state;

	@Column(name= "district")
	private String district;

	@Column(name= "taluka")
	private String taluka;

	@Column(name= "area")
	private String area;

	@Column(name= "address")
	private String address;

	@Column(name= "blood_group")
	private String bloodGroup;

	@Column(name= "hospital_id")
	private Integer hospitalId;

	@Column(name= "document_no")
	private String documentNumber;

	@Column(name= "adhar_no")
	private String aadharNumber;

	@Column(name= "maidenName")
	private String maidenName;

	@Column(name= "husbandName")
	private String husbandName;

	@Column(name= "abhaNumber")
	private String abhaNumber;

	@Column(name= "priority")
	private String priority;

	@Column(name= "reffered_by")
	private String referredBy;




}