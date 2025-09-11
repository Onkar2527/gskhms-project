package com.codecraft.master.models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class HospitalInfraDTO {

    private List<FloorDTO> floors;
}
