package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name="department")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Department  extends Auditable {
	@Id
	@Column(name= "department_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer deptId;

	@Column(name= "department_name")
	private String deptName;

	@Column(name= "department_status")
	private String status;

	@Column(name= "department_hospital_id")
	private Integer hospitalId;

	@Column(name= "department_section")
	private String sectionId;
}
