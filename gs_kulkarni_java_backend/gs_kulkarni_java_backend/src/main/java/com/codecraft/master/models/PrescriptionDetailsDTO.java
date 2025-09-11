package com.codecraft.master.models;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDetailsDTO {

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

    private String unitName;

    private Integer doctorId;

    private String doctorName;

    private String createdBy;

}
