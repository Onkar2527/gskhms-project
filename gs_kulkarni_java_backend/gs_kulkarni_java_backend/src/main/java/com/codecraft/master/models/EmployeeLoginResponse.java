package com.codecraft.master.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeLoginResponse {

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

	private String hospitalCode;
	private String xrayServices;
	private String ipdServices;
	private String labServices;

	private String discountApplicable;
    private String insuranceAvailable;
}