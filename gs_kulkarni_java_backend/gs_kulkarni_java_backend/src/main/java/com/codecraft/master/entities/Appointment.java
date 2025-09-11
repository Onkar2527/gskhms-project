package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="appointment")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Appointment extends Auditable {
	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name= "timestamp")
	private Date createdTimestamp;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name= "date")
	private Date appointmentDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name= "time")
	private Date appointmentTime;

	@Column(name= "number")
	private String appointmentNumber;

	@Column(name= "patient_id")
	private Integer patientId;

	@Column(name= "department_id")
	private Integer deptId;

	@Column(name= "section_id")
	private Integer sectionId;

	@Column(name= "primary_doctor_id")
	private Integer doctorId;

	@Column(name= "secoundry_doctor_id")
	private Integer secDoctorId;

	@Column(name= "patient_category_id")
	private Integer patientCatId;

	@Column(name= "patient_company_id")
	private Integer patientCompId;

	@Column(name= "employee_id")
	private Integer employeeId;

	@Column(name= "status")
	private String status;

	@Column(name= "healthcard_number")
	private String healthcardNo;

	@Column(name= "insurance_policy_number")
	private String insurancePolicyNumber;

	@Column(name= "refference_hospital")
	private String referralHospital;

	@Column(name= "refference_doctor")
	private String referralDoctor;

	@Column(name= "relative_name")
	private String relativeName;

	@Column(name= "relative_relation")
	private String relativeRelation;

	@Column(name= "relative_contact")
	private String relativeContact;

	@Column(name= "remark")
	private String remark;

	@Column(name= "type")
	private String type;

	@Column(name= "mlc_status")
	private String mlcStatus;

	@Column(name= "visit_no")
	private String visitNo;

	@Column(name= "gross_amount")
	private double grossAmount;

	@Column(name= "discount_amount")
	private double discount;

	@Column(name= "net_amount")
	private double netAmount;

	@Column(name= "hospital_id")
	private Integer hospitalId;

	@Column(name= "mobile_no")
	private String mobileNumber;

	@Column(name= "name_prefix")
	private String namePrefix;

	@Column(name= "first_name")
	private String firstName;

	@Column(name= "last_name")
	private String lastName;

	@Column(name= "middle_name")
	private String middleName;

	@Column(name= "document_no")
	private String documentNumber;

	@Column(name= "service_id")
	private Integer serviceId;

	@Column(name= "service_amount")
	private Double serviceAmount;

	@Column(name= "dob")
	private Date dob;

	@Column(name= "gender")
	private String gender;

	@Column(name= "address")
	private String address;

	@Column(name= "special_instruction")
	private String specialInstruction;

	@Column(name= "disease")
	private String disease;

	@Column(name= "adhar_no")
	private String aadharNumber;

	@Column(name= "instruction")
	private String instruction;

	@Column(name= "operation_recommended")
	private Boolean operationRecommended;

	@Column(name= "operation_details")
	private String operationDetails;

	@Column(name= "admission_recommended")
	private Boolean admissionRecommended;

	@Column(name= "admission_details")
	private String admissionDetails;

	@Column(name= "is_emergency")
	private Boolean isEmergency;

	@Column(name= "payment_status")
	private String paymentStatus;

	@Column(name= "organisation_category_id")
	private Integer categoryId;

	@Column(name= "organisation_id")
	private Integer organizationId;

	@Column(name= "discharge_status")
	private Boolean dischargeStatus;

	@Column(name= "discharge_note")
	private String dischargeNote;

	@Column(name= "discharge_date")
	private Date dischargeDate;

	@Column(name= "maidenName")
	private String maidenName;

	@Column(name= "husbandName")
	private String husbandName;

	@Column(name= "abhaNumber")
	private String abhaNumber;

	@Column(name= "father_name")
	private String fatherName;

	@Column(name= "priority")
	private String priority;

	@Column(name= "age")
	private String age;
	@Column(name= "reffered_by")
	private String referredBy;



	public Appointment(Integer id) {
		this.id = id;
	}
}