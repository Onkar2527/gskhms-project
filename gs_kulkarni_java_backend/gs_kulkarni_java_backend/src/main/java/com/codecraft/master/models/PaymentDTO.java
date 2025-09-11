package com.codecraft.master.models;

import com.codecraft.master.entities.AppointmentServiceEntity;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class PaymentDTO {
	private Integer id;

	private Integer appointmentId;

	private Integer billingId;

	private String paymentMode;

	private String transactionNumber;

	private Double amount;

	private String paymentStatus;

	private String paymentNumber;

	private Integer hospitalId;

	private String documentNumber;
	private String serviceName;

	private Date paymentDate;

	private String appointmentNumber;

	private String UHIDNumber;

	private String firstName;

	private String lastName;
	private String aadharNumber;
	private String mobileNumber;

	private  Integer serviceId;
	private String serviceType;

	private  String otherDescription;
	private  String createdBy;
	private  String description;
	private  Boolean isServicePayment;
	private  String type;

	private List<AppointmentServiceEntity> appointmentServiceList;

}