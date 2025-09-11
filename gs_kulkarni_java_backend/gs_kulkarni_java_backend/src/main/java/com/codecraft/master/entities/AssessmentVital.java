package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="assessment_vital")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentVital extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "measure_time")
	private Date measureTime;

	@Column(name= "appointment_id")
	private Integer appointmentId;

	@Column(name= "pulse")
	private String pulse;

	@Column(name= "rr")
	private String rr;

	@Column(name= "bp")
	private String bp;

	@Column(name= "temperature")
	private String temperature;

	@Column(name= "hr")
	private String hr;

	@Column(name= "spo2")
	private String spo2;

	@Column(name= "abd_grith")
	private String abdGrith;

	@Column(name= "weight")
	private String weight;

	@Column(name= "others")
	private String others;

	@Column(name= "hospital_id")
	private Integer hospitalId;

	@Column(name= "fhs")
	private String fhs;
	
}