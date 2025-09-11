package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "services")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Services  extends Auditable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "SG_id")
    private Integer serviceGroupId;

    @Column(name = "department_id")
    private Integer deptId;

    @Column(name = "sub_department_id")
    private Integer subDeptId;

    @Column(name = "rate")
    private double rate;

    @Column(name = "status")
    private String status;

    @Column(name = "hospital_id")
    private Integer hospitalId;

    @Column(name = "effective_date")
    private Date effectiveRateDate;

    @Column(name = "rate_change_applicable")
    private Boolean rateChangeApplicable;

    @Column(name = "other_yn")
    private String otherService;


}
