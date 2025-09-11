package com.codecraft.master.models;

import com.codecraft.master.entities.Patient;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BedDTO {

	private Integer id;

	private String name;

	private Integer roomId;
	private String roomName;

	private String status;

	private Integer hospitalId;
	private Integer doctorId;
	private Integer secDoctorId;

	private String note;

	private Patient patient;
}