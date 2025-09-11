package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="discharge_summary")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DischargeSummary extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "appointment_id")
	private Integer appointmentId;

	@Column(name= "summary_of_inv")
	private String summaryOfInvestigation;

	@Column(name= "course_of_hospital_inv")
	private String courseOfHospitalInv;

	@Column(name= "treatment_given")
	private String treatmentGiven;

	@Column(name= "condn_discharge_time")
	private String conditionDischargeTime;

	@Column(name= "advise_discharge_time")
	private String adviseDischargeTime;

	@Column(name= "emergence_after_discharge")
	private String emergencyAfterDischarge;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name= "followup_date")
	private Date followupDate;

	@Column(name= "hospital_id")
	private Integer hospitalId;
	
}