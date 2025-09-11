package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="payments")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Payment  extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name="appoinment_id")
	private Appointment appointment;

	@Column(name= "service_id")
	private Integer serviceId;

	@Column(name= "billing_id")
	private Integer billingId;

	@Column(name= "payment_mode")
	private String paymentMode;

	@Column(name= "transaction_no")
	private String transactionNumber;

	@Column(name= "amount")
	private Double amount;

	@Column(name= "payment_status")
	private String paymentStatus;

	@Column(name= "hospital_id")
	private Integer hospitalId;

	@Column(name= "document_no")
	private String documentNumber;

	@Column(name= "payment_date")
	private Date paymentDate;

	@Column(name= "description")
	private String description;

	@Column(name= "is_service_payment")
	private Boolean isServicePayment;
}