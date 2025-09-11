package com.codecraft.master.models;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CasualityDetailDTO {

	private Integer id;

	private Integer casualtyId;

	private String note;

	private String noteDescription;

}