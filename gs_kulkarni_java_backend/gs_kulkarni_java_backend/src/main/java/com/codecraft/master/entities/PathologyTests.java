package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="pathalogy_test")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PathologyTests extends Auditable {
	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "name")
	private String name;

	@Column(name= "charges")
	private Double charges;

	@Column(name= "unit_name")
	private String unitName;

	@Column(name= "type")
	private String type;

	@Column(name="hospital_id")
	private Integer hospitalId;
	@Column(name= "description")
	private String description;

}
