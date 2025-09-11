package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Getter
@Setter
@Entity
@Table(name="employee")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Employee  extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer employeeId;

	@Column(name="photo")
	private String photo;
	@Column(name="first_name")
	private String firstName;
	@Column(name="middle_name")
	private String middleName;
	@Column(name="last_name")
	private String lastName;

	@Column(name="email")
	private String emailId;
	@Column(name="password")
	private String password;
	@Column(name="hospital_id")
	private Integer hospitalId;

	@Column(name="reg_timestamp")
	private Date regTimestamp;

	@Column(name="reg_number")
	private String userRegNumber;

	@Column(name="mobile_number")
	private String mobileNumber;

	@Column(name="alt_mobile_number")
	private String altMobileNumber;

	@Column(name="gender")
	private String gender;

	@Column(name="type")
	private String userType;

	@Column(name="status")
	private String status;

	@Column(name="dob")
	private Date dob;

	@Column(name="date_of_joined")
	private Date dateOfJoining;

	@Column(name="designation_id")
	private Integer designationId;

	@Column(name="specialization_id")
	private Integer specializationId;

	@Column(name="adhar_no")
	private String adharNumber;

	@Column(name="mother_name")
	private String motherName;

	@Column(name="marital_status")
	private String maritalStatus;

	@Column(name="blood_group")
	private String bloodGroup;

	@Column(name="probation_period")
	private String probationPeriod;

	@Column(name="confirmation_date")
	private Date confirmationDate;

	@Column(name="uan_number")
	private String uanNumber;

	@Column(name="current_address")
	private String currentAddress;

	@Column(name="current_area")
	private String currentArea;

	@Column(name="current_taluka")
	private String currentTaluka;

	@Column(name="current_district")
	private String currentDistrict;

	@Column(name="current_state")
	private String currentState;

	@Column(name="current_pincode")
	private String currentPincode;

	@Column(name="permanant_address")
	private String permanantAddress;

	@Column(name="permanent_area")
	private String permanantArea;

	@Column(name="permanent_taluka")
	private String permanantTaluka;

	@Column(name="permanent_district")
	private String permanantDistrict;

	@Column(name="permanent_state")
	private String permanantState;

	@Column(name="permanent_pincode")
	private String permanantPincode;

	@Column(name="show_all_hospital_data")
	private String showAllHospitalData;
}