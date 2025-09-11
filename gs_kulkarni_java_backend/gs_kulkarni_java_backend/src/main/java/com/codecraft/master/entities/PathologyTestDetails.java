package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="pathalogy_test_dtl")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PathologyTestDetails extends Auditable {
	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "name")
	private String name;

	@Column(name= "unit_name")
	private String unitName;

	@Column(name= "test_type")
	private String testType;

	@Column(name= "normal_min")
	private Double normalMin;

	@Column(name= "normal_max")
	private Double normalMax;

	@Column(name= "pathalogy_test_id")
	private Integer pathologyTestId;

	@Column(name= "formula")
	private String formula;

	@Column(name= "m_n_r_l")
	private Double maleNormalRangeMin;

	@Column(name= "m_n_r_u")
	private Double maleNormalRangeMax;

	@Column(name= "f_n_r_l")
	private Double femaleNormalRangeMin;

	@Column(name= "f_n_r_u")
	private Double femaleNormalRangeMax;

	@Column(name= "depend_on_age")
	private String dependOnAge;

	@Column(name= "method_desc")
	private String methodDesc;

	@Column(name= "descriptive_range")
	private String descriptiveRange;

	@Column(name= "descriptive_range_m")
	private String descriptiveRangeM;

	@Column(name= "descriptive_range_f")
	private String descriptiveRangeF;

}
