package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="casualty_hdr")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CasualityHeader extends Auditable {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "patient_id")
	private Integer patientId;

	@Column(name= "appoinment_id")
	private Integer appointmentId;

	@Column(name= "chief_complaints")
	private String chiefComplaints;

	@Column(name= "history")
	private String history;

	@Column(name= "trauma")
	private String trauma;

	@Column(name= "medical_comorbidities")
	private String medicalComorbidities;

	@Column(name= "previous_treatments")
	private String previousTreatments;

}