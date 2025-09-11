package com.codecraft.master.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentSearchRequest {

	private Date appointmentDate;

	private Integer patientId;

	private Integer id;

	private Integer doctorId;
	private String type;
	private String firstName;
	private String lastName;
	private String mobileNumber;
	private Boolean dischargeStatus;

	private List<String> statuses;
	private Boolean operationRecommended;

	private Boolean admissionRecommended;

	private Boolean isEmergency;

	private Integer hospitalId;
	private Date appointmentStartDate;
	private Date appointmentEndDate;

}
