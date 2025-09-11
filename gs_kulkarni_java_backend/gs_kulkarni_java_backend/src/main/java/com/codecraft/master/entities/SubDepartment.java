package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="sub_department")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SubDepartment  extends Auditable {
	@Id
	@Column(name= "SD_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer subDeptId;

	@Column(name= "SD_name")
	private String subDeptName;

	@Column(name= "SD_department_id")
	private Integer deptId;

	@Column(name= "SD_status")
	private String status;

	@Column(name= "SD_hospital_id")
	private Integer hospitalId;

}
