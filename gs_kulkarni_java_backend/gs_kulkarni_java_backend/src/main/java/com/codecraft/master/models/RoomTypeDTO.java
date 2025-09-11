package com.codecraft.master.models;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RoomTypeDTO{

	private Integer id;

	private String name;

	private Integer billingClassId;
	private String billingClassName;

	private String status;

	private Integer hospitalId;
}