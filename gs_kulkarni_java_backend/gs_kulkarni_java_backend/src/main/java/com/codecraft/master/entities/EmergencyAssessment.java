package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "emergency_assessment")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyAssessment extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "admission_date")
    private Date admissionDate;

    @Column(name = "patient_id")
    private Integer patientId;
    @Column(name = "appointment_id")
    private Integer appointmentId;
    @Column(name = "doctor_id")
    private Integer doctorId;
    @Column(name = "assessment_vital_id")
    private Integer assessmentVitalId;

    @Column(name = "consultant")
    private String consultant;
    @Column(name = "brought_by_vehicle")
    private String broughtByVehicle;
    @Column(name = "vehicle_identity")
    private String vehicleIdentity;
    @Column(name = "pre_hospital_care")
    private String preHospitalCare;
    @Column(name = "pre_hospital_care_details")
    private String preHospitalCareDetails;
    @Column(name = "allergies")
    private String allergies;
    @Column(name = "last_meal_details")
    private String lastMealDetails;
    @Column(name = "last_meal_time")
    private String lastMealTime;
    @Column(name = "medications")
    private String medications;
    @Column(name = "past_medical_history")
    private String pastMedicalHistory;
    @Column(name = "past_sergical_history")
    private String pastSergicalHistory;
    @Column(name = "events_leading_to_trauma")
    private String eventsLeadingToTrauma;
    @Column(name = "pain_score")
    private Integer painScore;
    @Column(name = "admit_status")
    private String admitStatus;
    @Column(name = "hospital_id")
    private Integer hospitalId;

}