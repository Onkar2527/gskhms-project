package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="casualty_dtl")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CasualityDetail extends Auditable {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "casualty_id")
	private Integer casualtyId;

	@Column(name= "note")
	private String note;

	@Column(name= "note_description")
	private String noteDescription;

}