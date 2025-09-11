package com.codecraft.master.models;

import com.codecraft.master.entities.BillingDetails;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BillingHeaderDTO {

	private Integer id;

	private String docType;

	private Integer docId;

	private Integer patientId;

	private Date billingDate;

	private Double taxableAmount;

	private Double totalTax;

	private Double grandTotal;

	private Double balanceAmount;

	private Double paidAmount;

	private Integer hospitalId;

	private String documentNumber;

	private List<BillingDetailsDTO> billingDetailsList;

	private String patientName;
	private String mobileNumber;
	private String address;
	private String doctorName;
	private String patientUHIDNumber;
	private String billingStatus;
	private String aadharNumber;
	private String type;
	private String createdBy;
}