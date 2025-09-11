package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="package_master")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PackageMaster extends Auditable {
	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "name")
	private String name;

	@Column(name= "package_type")
	private String packageType;

	@Column(name= "charges")
	private String charges;

	@Column(name="hospital_id")
	private Integer hospitalId;

	@Column(name="dept_id")
	private Integer deptId;

}
