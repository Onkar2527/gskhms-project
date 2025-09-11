package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="package_master_dtl")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PackageMasterDetails extends Auditable {
	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "package_id")
	private Integer packageId;

	@Column(name= "service_id")
	private Integer serviceId;

	@Column(name= "type")
	private String type;

	@Column(name= "charges")
	private Integer charges;
}