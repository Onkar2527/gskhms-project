package com.codecraft.master.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillingDashboardResponse {
	private Integer hospitalId;
	private Long todayAppointments;
	private Long todayRegistrations;
	private Long todayRegistrationConfirmed;
	private Long todayRegistrationWaiting;
	private Double todayEarning;
	private Double todayEarningCash;
	private Double todayEarningOnline;
	private Long todayOperations;
	private Long todayNewReq;
}
