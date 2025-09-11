package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "services_group")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ServiceGroup  extends Auditable {
	@Id
	@Column(name = "SG_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer groupId;

	@Column(name = "SG_name")
	private String groupName;

	@Column(name = "SG_hospital_id")
	private Integer hospitalId;

}
