package com.codecraft.master.specifications;

import com.codecraft.master.entities.Appointment;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;
import java.util.List;

public class AppointmentSpecification {

    private AppointmentSpecification(){}

    public static Specification<Appointment> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<Appointment> withPrimaryDoctorId(Integer doctorId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("doctorId"), doctorId));
    }

    public static Specification<Appointment> withPatientId(Integer patientId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }

    public static Specification<Appointment> withType(String type){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type));
    }

    public static Specification<Appointment> withAppointmentDate(Date date){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("appointmentDate"), criteriaBuilder.literal(DateHelper.getStartOfDay(date)), criteriaBuilder.literal(DateHelper.getEndOfDay(date))));
    }

    public static Specification<Appointment> withAppointmentDateLessThan(Date date){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("appointmentDate"), criteriaBuilder.literal(DateHelper.getStartOfDay(date))));
    }

    public static Specification<Appointment> withAppointmentDateGreaterThan(Date date){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("appointmentDate"), criteriaBuilder.literal(DateHelper.getEndOfDay(date))));
    }

    public static Specification<Appointment> withStatusIn(List<String> status) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("status").in(status)));
    }

    public static Specification<Appointment> withDischargeStatus(Boolean dischargeStatus) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("dischargeStatus"),dischargeStatus));
    }

    public static Specification<Appointment> withMobileNumber(String mobileNumber) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("mobileNumber"), mobileNumber));
    }

    public static Specification<Appointment> withFirstName(String firstName) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("firstName"), "%" +firstName+"%" ));
    }

    public static Specification<Appointment> withLastName(String lastName) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("lastName"), "%" +lastName+"%" ));
    }

    public static Specification<Appointment> withIsEmergency(Boolean isEmergency) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("isEmergency"), isEmergency));
    }

    public static Specification<Appointment> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<Appointment> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<Appointment> withOperationRecommended(Boolean operationRecommended) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("operationRecommended"), operationRecommended));
    }

    public static Specification<Appointment> withAdmissionRecommended(Boolean admissionRecommended) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("admissionRecommended"), admissionRecommended));
    }

    public static Specification<Appointment> withAppointmentDateBetween(Date startDate, Date endDate){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.<Date>get("appointmentDate"), criteriaBuilder.literal(DateHelper.getStartOfDay(startDate)), criteriaBuilder.literal(DateHelper.getEndOfDay(endDate))));
    }

}
