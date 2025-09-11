package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="hospital")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Hospital  extends Auditable {
	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "reg_timestamp")
	private Date regTimeStamp;

	@Column(name= "name")
	private String name;

	@Column(name= "mobile_number")
	private String mobileNumber;

	@Column(name= "email_id")
	private String email;

	@Column(name= "address")
	private String address;

	@Column(name= "area")
	private String area;

	@Column(name= "taluka")
	private String taluka;

	@Column(name= "dist")
	private String dist;

	@Column(name= "state")
	private String state;

	@Column(name= "pincode")
	private String pinCode;

	@Column(name= "geocoordinate")
	private String geocoordinates;

	@Column(name= "status")
	private String status;

	@Column(name= "logo")
	private String logo;

	@Column(name= "report_header")
	private String reportHeader;

	@Column(name= "gst_no")
	private String gstNumber;

	@Column(name= "website")
	private String website;
	
	@Column(name= "hospital_code")
	private String hospitalCode;
	
	@Column(name= "reg_no")
	private String regNo;
	
	@Column(name= "lic_no")
	private String licNo;

	@Column(name= "xray_services")
	private String xrayServices;

	@Column(name= "lab_services")
	private String labServices;

	@Column(name= "sono_services")
	private String sonoServices;

	@Column(name= "ipd_services")
	private String ipdServices;

	@Column(name= "discount_applicable")
	private String discountApplicable;

	@Column(name= "insurance_available")
	private String insuranceAvailable;

}
