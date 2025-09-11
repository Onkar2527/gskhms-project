package com.codecraft.master.models;

import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.util.Date;
import java.util.List;


@Getter
@Setter
public class LabRegistrationStatusDTO {

    private Integer id;

    private String labNumber;

    private String status;

    private Date sampleCollected;

    private Date reportGenerated;
    private Time sampleCollectedTime;

    private String approvalStatus;


    private String approvedBy;


    private String approvalNote;


    private Date approvalDate;



}