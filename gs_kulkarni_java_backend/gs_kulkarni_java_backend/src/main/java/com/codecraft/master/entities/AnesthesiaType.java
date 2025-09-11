package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="anesthesia_type")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AnesthesiaType extends Auditable {
    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "name")
    private String name;

    @Column(name= "hospital_id")
    private Integer hospitalId;
}
