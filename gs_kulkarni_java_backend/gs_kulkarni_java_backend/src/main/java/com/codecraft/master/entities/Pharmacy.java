package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="pharmacy")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Pharmacy  extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "medecine_name")
	private String medecineName;

	@Column(name= "unit_name")
	private String unitName;

	@Column(name= "content")
	private String content;

	@Column(name= "description")
	private String description;

	@Column(name= "frequency")
	private String frequency;

	@Column(name= "diagnosis")
	private String diagnosis;

	@Column(name= "remark")
	private String remark;

	@Column(name= "physio_name")
	private String physioName;

	@Column(name= "dosage")
	private Integer dosage;

	@Column(name= "till_day")
	private Integer tillDays;

	@Column(name= "quanity")
	private Integer quantity;

}