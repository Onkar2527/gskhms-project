package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="lab_test_dtl")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LabTestDetails extends Auditable {

    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "registration_id")
    private Integer registrationId;

    @Column(name= "test_Header_id")
    private Integer testHeaderId;

    @Column(name= "service_id")
    private Integer serviceId;

    @Column(name= "service_det_id")
    private Integer serviceDetailedId;

    @Column(name= "value")
    private String value;

    @Column(name= "normal_min")
    private Double normalMin;

    @Column(name= "normalMax")
    private Double normalMax;
}