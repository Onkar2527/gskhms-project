package com.codecraft.master.models;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentServiceDTO {
	private Integer id;

	private Integer appointmentId;

	private Integer serviceId;

	private Double charges;

	private String type;

	private String serviceName;

	private String labNoGenerated ;

	private String labNumber;

	private String otherDescription;

	private String paymentNumber;

	private String paymentStatus;
}