package com.codecraft.master.models;

import com.codecraft.master.entities.Patient;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DischargeSummaryDTO {

	private Integer id;

	private Integer appointmentId;

	private String summaryOfInvestigation;

	private String courseOfHospitalInv;

	private String treatmentGiven;

	private String conditionDischargeTime;

	private String adviseDischargeTime;

	private String emergencyAfterDischarge;

	private Date followupDate;
	private Date admissionDate;
	private Date dischargeDate;
	private String dischargeNote;
	private Boolean dischargeStatus;
	private Patient patient;


	private Integer doctorId;
	private String doctorName;

	private Integer secDoctorId;
	private String secDoctorName;

	private String chiefComplaint;
	private String provisionalDiagnosis;
	private String finalDiagnosis;
	private Integer hospitalId;

	private List<AssessmentVitalDTO> assessmentVitalDTOList;
}