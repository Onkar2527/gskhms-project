package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="appointment_bed_assign")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentBedAssign extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "bed_id")
	private Integer bedId;

	@Column(name= "appointment_id")
	private Integer appointmentId;

	@Column(name= "start_timestamp")
	private Date startTime;

	@Column(name= "end_timestamp")
	private Date endTime;

	@Column(name= "hospital_id")
	private Integer hospitalId;

	@Column(name= "status")
	private String status;
}