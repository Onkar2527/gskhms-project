package com.codecraft.master.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CasualityHeaderDTO {

	private Integer id;

	private Integer patientId;

	private Integer appointmentId;

	private String chiefComplaints;

	private String history;

	private String trauma;

	private String medicalComorbidities;

	private String previousTreatments;

	private String recordCreatedBy;

	private List<CasualityDetailDTO> casualityDetailList;

}