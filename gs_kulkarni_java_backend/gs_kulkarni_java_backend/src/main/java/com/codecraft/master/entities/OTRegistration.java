package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "ot_registration")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OTRegistration extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "patient_id")
    private Integer patientId;

    @Column(name = "appoinment_id")
    private Integer appointmentId;

    @Column(name = "ot_master_id")
    private Integer otMasterId;

    @Column(name = "operation_type_name")
    private String operationTypeName;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "in_date")
    private Date inDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "out_date")
    private Date outDate;

    @Column(name = "anestasia_induced_by")
    private String anaesthesiaInducedBy;

    @Column(name = "operating_surgrons")
    private String operatingSurgeons;

    @Column(name = "implants_used")
    private String implantsUsed;

    @Column(name = "hospital_id")
    private Integer hospitalId;

}