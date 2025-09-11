package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.util.Date;


@Getter
@Setter
@Entity
@Table(name="lab_registration")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LabRegistration extends Auditable {

    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "lab_no")
    private String labNumber;

    @Column(name= "patient_id")
    private Integer patientId;

    @ManyToOne
    @JoinColumn(name="appoinment_id")
    private Appointment appointment;

    @Column(name= "status")
    private String status;

    @Column(name= "sample_collected")
    private Date sampleCollected;

    @Column(name= "sample_collected_time")
    private Time sampleCollectedTime;

    @Column(name= "report_generated")
    private Date reportGenerated;

    @Column(name= "registration_date")
    private Date registrationDate;

    @Column(name = "type")
    private String type;

    @Column(name = "hospital_id")
    private Integer hospitalId;


    @Column(name = "approval_status")
    private String approvalStatus;


    @Column(name = "approved_by")
    private String approvedBy;


    @Column(name = "approval_note")
    private String approvalNote;


    @Column(name = "approval_datetime")
    private Date approvalDate;

}