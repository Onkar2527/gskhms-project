package com.codecraft.master.models;

import com.codecraft.master.audit.Auditable;
import com.codecraft.master.entities.LabTestHeader;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.util.Date;
import java.util.List;


@Getter
@Setter
public class LabRegistrationDTO {

    private Integer id;

    private String labNumber;

    private Integer patientId;

    private Integer appointmentId;

    private String lastName;
    private String firstName;
    private String mobileNumber;
    private Date dob;
    private String gender;

    private String status;

    private Date sampleCollected;

    private Date reportGenerated;

    private Date registrationDate;
    private String doctorName;
    private String registrationNumber;
    private Time sampleCollectedTime;
    private String type;

    private String approvalStatus;


    private String approvedBy;


    private String approvalNote;


    private Date approvalDate;
    private String paymentStatus;


    private List<LabTestHeaderDTO> labTestHeaderList;

}