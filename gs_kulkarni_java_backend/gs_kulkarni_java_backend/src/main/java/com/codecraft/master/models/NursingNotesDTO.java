package com.codecraft.master.models;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NursingNotesDTO {

    private Integer id;

    private Date notesDate;

    private Integer appointmentId;

    private Integer patientId;
    private Integer doctorId;
    private Integer nurseId;

    private String personalHygiene;


    private String mlcDetails;


    private String bedSoreStatus;


    private String positionAdvised;

    private String investigationDone;

    private String generalCondition;

    private String trpBP;

    private String ioChartGenerated;

    private String medicationAdministration;

    private String dueDrug;

    private String notAdministratedMedicines;

    private String bslChart;
    private String cleanDressing;
    private String infectedDressings;
    private String vacDressings;
    private String graftingDressings;
    private String plaster;

    private String physiotherapy;
    private String traction;
    private String nebulization;
    private String dietAdvised;
    private String bloodProductAdvised;
    private String poilChecked;
    private String surgeryAdvised;

    private String nbm;
    private String preOperativeChecklist;
    private String consents;
    private String catheterCare;
    private String centralLineCare;
    private String patientCritical;

    private String hishRiskContent;
    private String ptComplaintsInformed;
    private String motionPass;
    private String noDues;
    private String dischargeProcess;
    private String damaConsent;
    private String handOverDone;


    private String namePrefix;
    private String firstName;
    private String middleName;
    private String lastName;
    private String fatherName;
    private Date dob;
    private String gender;
    private String maritalStatus;
    private String mobileNumber;

    private String patientUHIDNumber;
    private String appointmentNumber;


    private Integer hospitalId;

}