package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="template_dtl")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TemplateDetails extends Auditable {

    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "template_id")
    private Integer templateId;

    @Column(name= "medicine_name")
    private String medicineName;

    @Column(name= "frequency")
    private String frequency;

    @Column(name= "diagnosis")
    private String diagnosis;

    @Column(name= "remark")
    private String remark;

    @Column(name= "physio_name")
    private String physioName;

    @Column(name= "unit_name")
    private String unitName;

    @Column(name= "dosage")
    private Integer dosage;

    @Column(name= "till_day")
    private Integer tillDays;

    @Column(name= "quanity")
    private Integer quantity;



}