package com.codecraft.master.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDashboardResponse {
	private Integer hospitalId;
	private Long todayAppointments;
	private Long totalDoctorAppointments;
	private Long totalDoctorConfirmedAppointments;
	private Long totalDoctorWaitingAppointments;
	private Long totalDoctorAttendedAppointments;//Completed
	private Double todayDoctorEarning;
	private Double salary;
	private Double doctorEarning;
	private String payoutType;
}