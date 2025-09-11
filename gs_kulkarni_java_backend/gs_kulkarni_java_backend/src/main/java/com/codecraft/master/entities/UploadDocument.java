package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="document")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UploadDocument extends Auditable {

	@Id
	@Column(name= "document_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer docId;

	@Column(name= "document_timestamp")
	private Date docTimestamp;

	//Patient, User, Vender, Appointment
	@Column(name= "document_type")
	private String docType;

	@Column(name= "document_type_id")
	private Integer docTypeId;

	@Column(name= "document_name")
	private String docName;

	@Column(name= "document_number")
	private String docNumber;

	@Column(name= "document_path")
	private String docPath;

	@Column(name= "document_verify_status")
	private String verifyStatus;

	@Column(name= "document_verify_remark")
	private String verifyRemark;

	@Column(name= "document_hospital_id")
	private int hospitalId;


	
}
