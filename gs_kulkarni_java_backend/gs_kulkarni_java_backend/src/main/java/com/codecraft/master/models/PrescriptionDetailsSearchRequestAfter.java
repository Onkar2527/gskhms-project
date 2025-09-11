package com.codecraft.master.models;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDetailsSearchRequestAfter {

    private Integer id;

    private Date prescriptionDate;

    private String medicineName;

    private Double morning;

    private Double afternoon;

    private Double evening;

    private String route;

    private Integer duration;

    private String consume;

    private Integer appointmentId;

    private Integer hospitalId;
    
    private String quantity;
    
    private String doses;

    private String frequency;

    private Integer dosage;

    private Integer tillDay;
    private Integer doctorId;

    private String unitName;

    private String sortDateBy;
}
