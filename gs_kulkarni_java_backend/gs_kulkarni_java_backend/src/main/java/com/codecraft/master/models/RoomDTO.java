package com.codecraft.master.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {

	private Integer id;

	private String name;

	private Integer floorId;
	private String floorName;


	private Integer roomTypeId;
	private String roomTypeName;

	private Integer totalBed;

	private String status;

	private Integer hospitalId;

	private List<BedDTO> beds;
}