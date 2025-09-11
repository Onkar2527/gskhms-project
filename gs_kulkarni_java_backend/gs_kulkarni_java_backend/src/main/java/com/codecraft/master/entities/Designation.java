package com.codecraft.master.entities;


import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="designation")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Designation  extends Auditable {
	@Id
	@Column(name= "designation_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "designation_type")
	private String type;

	@Column(name= "designation_name")
	private String name;

	@Column(name= "designation_status")
	private String status;

	@Column(name= "designation_hospital_id")
	private Integer hospitalId;

}
