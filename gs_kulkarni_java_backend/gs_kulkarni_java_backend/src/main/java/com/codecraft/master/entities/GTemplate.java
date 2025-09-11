package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="gynecology_template")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class GTemplate extends Auditable {

    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "operation_name")
    private String operation_name;

    @Column(name= "pre_op")
    private String pre_op;

    @Column(name= "procedure_op")
    private String procedure_op;

    @Column(name= "post_op")
    private String post_op;

    @Column(name= "addition_description")
    private String addition_description;

    @Column(name= "treatment")
    private String treatment;
}