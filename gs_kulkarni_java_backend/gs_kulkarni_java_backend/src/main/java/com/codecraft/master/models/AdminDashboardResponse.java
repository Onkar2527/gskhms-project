package com.codecraft.master.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
	private Integer hospitalId;
	private Long todayAppointments;
	private Long todayOperations = 0L;
	private Long todayNewReq;
	private Double todayEarning;

}
