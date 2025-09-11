package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="billing_detail")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BillingDetails  extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	//Billing header id.
	@Column(name= "billing_id")
	private Integer billingId;

	@Column(name= "service_id")
	private Integer serviceId;

	@Column(name= "description")
	private String description;

	@Column(name= "type")
	private String serviceType;

	@Column(name= "amount")
	private Double amount;

	@Column(name = "other_description")
	private String otherDescription;
}