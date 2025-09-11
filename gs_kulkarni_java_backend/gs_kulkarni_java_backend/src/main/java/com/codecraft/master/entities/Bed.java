package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="bed")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Bed  extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "name")
	private String name;

	@Column(name= "room_id")
	private Integer roomId;

	@Column(name= "status")
	private String status;

	@Column(name= "note")
	private String note;

	@Column(name= "hospital_id")
	private Integer hospitalId;
	
}