package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="payout_details")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PayoutDetails extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "employee_id")
	private Integer employeeId;

	@Column(name= "payout_type")
	private String payoutType; //S/SI/CS/OC

	@Column(name= "salary")
	private Double salary;

	@Column(name= "incentive_based_on")
	private String incentiveBasedOn;

	@Column(name= "presc_template")
	private String prescriptionTemplate;

	@Column(name= "presc_template_text")
	private String prescriptionTemplateText;

	@Column(name= "on_call_service_charges")
	private Double onCallServiceCharges;

	@Column(name= "collection_limit")
	private Double collectionLimit;

	@Column(name= "collection_percentage")
	private Double collectionPercentage;

	@Column(name= "patient_count")
	private Integer patientCount;

	@Column(name= "per_patient_amount")
	private Double perPatientAmount;

	@Column(name= "revenue_percentage_share")
	private Double revenuePercentageShare;
	
}