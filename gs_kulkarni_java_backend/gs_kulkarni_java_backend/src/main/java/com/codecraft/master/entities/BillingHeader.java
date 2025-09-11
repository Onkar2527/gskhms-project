package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="billing_header")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BillingHeader  extends Auditable {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "doc_type")
	private String docType;

	@Column(name= "doc_id")
	private Integer docId;

	@Column(name= "patient_id")
	private Integer patientId;

	@Column(name= "billing_date")
	private Date billingDate;

	@Column(name= "taxable_amount")
	private Double taxableAmount;

	@Column(name= "total_tax")
	private Double totalTax;

	@Column(name= "grand_total")
	private Double grandTotal;

	@Column(name= "balance_amount")
	private Double balanceAmount;

	@Column(name= "paid_amount")
	private Double paidAmount;

	@Column(name= "hospital_id")
	private Integer hospitalId;

	@Column(name= "appointment_id")
	private Integer appointmentId;

	@Column(name= "document_no")
	private String documentNumber;

}