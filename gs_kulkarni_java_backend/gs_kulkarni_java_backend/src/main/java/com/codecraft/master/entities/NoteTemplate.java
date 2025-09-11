package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="note_template")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NoteTemplate extends Auditable {

	@Id
	@Column(name= "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name= "note_name")
	private String noteName;

	@Column(name= "note_description")
	private String noteDescription;
}