package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="organisation")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Organisation extends Auditable {
    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "name")
    private String name;

    @Column(name= "category_id")
    private Integer categoryId;

    @Column(name= "rate_percentage")
    private Double ratePercentage;

    @Column(name= "hospital_id")
    private Integer hospitalId;
}
