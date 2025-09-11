package com.codecraft.master.models;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FloorDTO {

	private Integer id;

	private String name;

	private String status;

	private Integer hospitalId;

	private List<RoomDTO> rooms;
}