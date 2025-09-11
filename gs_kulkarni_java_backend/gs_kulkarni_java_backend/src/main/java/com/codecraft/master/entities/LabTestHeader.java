package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="lab_test_hdr")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LabTestHeader extends Auditable {

    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "registration_id")
    private Integer registrationId;

    @Column(name= "service_id")
    private Integer serviceId;

    @Column(name = "status")
    private String status;

    @Column(name = "report_path")
    private String reportPath;
}