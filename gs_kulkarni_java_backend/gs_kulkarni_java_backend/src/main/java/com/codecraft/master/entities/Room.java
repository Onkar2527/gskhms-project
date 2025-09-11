package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="room")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Room  extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "name")
	private String name;

	@Column(name= "floor_id")
	private Integer floorId;

	@Column(name= "room_type_id")
	private Integer roomTypeId;

	@Column(name= "total_bed")
	private Integer totalBed;

	@Column(name= "status")
	private String status;

	@Column(name= "hospital_id")
	private Integer hospitalId;
}