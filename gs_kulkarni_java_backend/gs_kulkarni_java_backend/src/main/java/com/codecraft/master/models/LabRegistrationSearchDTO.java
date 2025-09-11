package com.codecraft.master.models;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;


@Getter
@Setter
public class LabRegistrationSearchDTO {

    private Integer registrationId;

    private String labNumber;

    private Integer patientId;

    private Integer appointmentId;

    private String status;
    private List<String> statuses;
    private  String type;

    private String approvalStatus;
    private String firstName;
    private String lastName;
    private Date registrationStartDate;
    private Date registrationEndDate;


}