package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name = "ot_master")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OTMaster extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ot_name")
    private String otName;

    @Column(name = "hospital_id")
    private Integer hospitalId;

}