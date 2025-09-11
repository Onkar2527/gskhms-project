package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="bank")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Bank  extends Auditable {

	@Id
	@Column(name= "bank_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer bankId;

	@Column(name= "bank_user_id")
	private Integer userId;

	@Column(name= "bank_account_holder_name")
	private String accountHolderName;

	@Column(name= "bank_account_number")
	private String accountNumber;

	@Column(name= "bank_ifsc_code")
	private String ifscCode;

	@Column(name= "bank_branch_name")
	private String branchName;

	@Column(name= "bank_hospital_id")
	private Integer hospitalId;
	
}