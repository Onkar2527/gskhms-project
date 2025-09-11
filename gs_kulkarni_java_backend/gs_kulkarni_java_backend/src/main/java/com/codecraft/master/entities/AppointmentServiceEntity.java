package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="appoinment_service")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentServiceEntity extends Auditable {
	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "appointment_id")
	private Integer appointmentId;

	@Column(name= "service_id")
	private Integer serviceId;

	@Column(name= "charges")
	private Double charges;

	@Column(name= "type")
	private String type;

	@Column(name= "package_type")
	private String packageType;

	@Column(name= "lab_no_generated")
	private String labNoGenerated;

	@Column(name= "lab_no")
	private String labNumber ;

	@Column(name = "other_description")
	private String otherDescription;

	@Column(name= "payment_no")
	private String paymentNumber;
}