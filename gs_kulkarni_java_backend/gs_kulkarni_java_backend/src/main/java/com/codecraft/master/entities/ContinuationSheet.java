package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="continuation_sheet")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ContinuationSheet extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "note_time")
	private Date noteTime;

	@Column(name= "appointment_id")
	private Integer appointmentId;

	@Column(name= "clinical_name")
	private String clinicalNotes;

	@Column(name= "advise")
	private String advise;

	@Column(name= "hospital_id")
	private Integer hospitalId;
	
}