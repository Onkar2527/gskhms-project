package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="billing_class")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BillingClass  extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "name")
	private String name;

	@Column(name= "status")
	private String status;

	@Column(name= "hospital_id")
	private Integer hospitalId;

	@Column(name= "charge_per_day")
	private Double chargePerDay;

	@Column(name= "charge_per_hour")
	private Double chargePerHour;

}