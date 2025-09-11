package com.codecraft.master.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LabTestDetailDTO {

    private Integer id;

    private Integer registrationId;

    private Integer testHeaderId;

    private Integer serviceId;

    private Integer serviceDetailedId;
    private String serviceDetailedName;
    private String unitName;

    private String value;
    private String formula;

    private Double normalMin;

    private Double normalMax;
    private String methodDesc;

    private String descriptiveRange;

    private String type;
}
