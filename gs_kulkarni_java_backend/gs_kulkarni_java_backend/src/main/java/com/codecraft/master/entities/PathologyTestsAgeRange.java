package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
@Table(name="pathology_tests_age_range")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PathologyTestsAgeRange extends Auditable {
    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "age_min")
    private Integer ageMin;

    @Column(name= "age_max")
    private Integer ageMax;

    @Column(name= "normal_min")
    private Double normalMin;

    @Column(name= "normal_max")
    private Double normalMax;

    @Column(name = "pathalogy_test_dtl_id")
    private Integer pathalogyTestDtlId;

    @Column(name= "m_n_r_l")
    private Double maleNormalRangeMin;

    @Column(name= "m_n_r_u")
    private Double maleNormalRangeMax;

    @Column(name= "f_n_r_l")
    private Double femaleNormalRangeMin;

    @Column(name= "f_n_r_u")
    private Double femaleNormalRangeMax;

    @Column(name= "descriptive_range_f")
    private String descriptiveRangeF;

    @Column(name= "descriptive_range_m")
    private String descriptiveRangeM;

}
