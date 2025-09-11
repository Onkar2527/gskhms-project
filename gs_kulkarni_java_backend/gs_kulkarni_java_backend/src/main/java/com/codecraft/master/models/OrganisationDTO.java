package com.codecraft.master.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganisationDTO {

    private Integer id;

    private String name;

    private Integer categoryId;

    private Double ratePercentage;

    private Integer hospitalId;

    private String categoryName;
}

