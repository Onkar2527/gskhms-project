package com.codecraft.master.models;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayoutDetailsDTO {
    private Integer id;

    private Integer employeeId;

    private String payoutType; //S/SI/CS/OC

    private Double salary;

    private String incentiveBasedOn;

    private String prescriptionTemplate;

    private String prescriptionTemplateText;

    private Double onCallServiceCharges;

    private Double collectionLimit;

    private Double collectionPercentage;

    private Integer patientCount;

    private Double perPatientAmount;

    private Double revenuePercentageShare;

}
