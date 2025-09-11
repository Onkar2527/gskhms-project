package com.codecraft.master.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReceptionDashboardResponse {
	private Integer hospitalId;
	private RegistrationDTO todaysPatient;
	private RegistrationDTO confirmedRegistrations;
	private RegistrationDTO waitingRegistrations;
}
