package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "medication_order_sheet")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MedicationOrderSheet extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "medication_date")
    private Date medicationDate;

    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Column(name = "patient_id")
    private Integer patientId;
    @Column(name = "doctor_id")
    private Integer doctorId;
    @Column(name = "nurse_id")
    private Integer nurseId;

    @Column(name = "medication")
    private String medication;

    @Column(name = "dose")
    private String dose;

    @Column(name = "route")
    private String route;

    @Column(name = "frequency")
    private String frequency;

    @Column(name = "hospital_id")
    private Integer hospitalId;

}