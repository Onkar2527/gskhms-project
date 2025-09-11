package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "prescription_detailsafter")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDetailsAfter  extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "prescription_date")
    private Date prescriptionDate;

    @Column(name = "medicine_name")
    private String medicineName;

    @Column(name = "morning")
    private Double morning;

    @Column(name = "afternoon")
    private Double afternoon;

    @Column(name = "evening")
    private Double evening;

    @Column(name = "route")
    private String route;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "consume")
    private String consume;

    @Column(name = "appoinment_id")
    private Integer appointmentId;

    @Column(name = "hospital_id")
    private Integer hospitalId;
    
    @Column(name = "quantity")
    private String quantity;
    
    @Column(name = "doses")
    private String doses;

    @Column(name = "frequency")
    private String frequency;

    @Column(name = "dosage")
    private Integer dosage;

    @Column(name = "till_day")
    private Integer tillDay;

    @Column(name = "unit_name")
    private String unitName;

    @Column(name = "doctor_id")
    private Integer doctorId;

}
