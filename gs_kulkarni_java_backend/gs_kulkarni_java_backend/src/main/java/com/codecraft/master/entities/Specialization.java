package com.codecraft.master.entities;


import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="specialization")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Specialization  extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "name")
	private String name;

	@Column(name= "hospital_id")
	private Integer hospitalId;

}
