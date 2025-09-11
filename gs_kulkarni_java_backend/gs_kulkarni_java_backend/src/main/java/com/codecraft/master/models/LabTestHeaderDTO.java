package com.codecraft.master.models;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class LabTestHeaderDTO {

    private Integer id;

    private Integer registrationId;

    private Integer serviceId;
    private String serviceName;

    private List<LabTestDetailDTO> labTestDetailsList;
    private String status;

    private String reportPath;

    private String type;
    private String testType;
    private String description;
}