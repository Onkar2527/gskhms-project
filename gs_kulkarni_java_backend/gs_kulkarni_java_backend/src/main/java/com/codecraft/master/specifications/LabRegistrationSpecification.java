package com.codecraft.master.specifications;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.LabRegistration;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;
import java.util.List;

public class LabRegistrationSpecification {

    private LabRegistrationSpecification(){}

    public static Specification<LabRegistration> withRegistrationId(Integer registrationId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), registrationId));
    }

    public static Specification<LabRegistration> withLabNumber(String labNumber){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("labNumber"), labNumber));
    }

    public static Specification<LabRegistration> joinFirstName(String input) {
        return new Specification<>() {
            public Predicate toPredicate(Root<LabRegistration> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Join<LabRegistration, Appointment> userProd = root.join("appointment");
                return cb.like(userProd.get("firstName"), "%" + input + "%");
            }
        };
    }

    public static Specification<LabRegistration> joinLastName(String input) {
        return new Specification<>() {
            public Predicate toPredicate(Root<LabRegistration> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Join<LabRegistration, Appointment> userProd = root.join("appointment");
                return cb.like(userProd.get("lastName"), "%" + input + "%");
            }
        };
    }

    public static Specification<LabRegistration> withPatientId(Integer patientId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }

    public static Specification<LabRegistration> withAppointmentId(Integer appointmentId){
        return new Specification<>() {
            public Predicate toPredicate(Root<LabRegistration> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Join<LabRegistration, Appointment> userProd = root.join("appointment");
                return cb.equal(userProd.get("id"),appointmentId);
            }
        };
    }

    public static Specification<LabRegistration> withStatus(String status){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status));
    }

    public static Specification<LabRegistration> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<LabRegistration> withType(String type) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type));
    }

    public static Specification<LabRegistration> withApprovalStatus(String approvalStatus) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("approvalStatus"), approvalStatus));
    }

    public static Specification<LabRegistration> withInStatuses(List<String> statuses) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("status").in(statuses)));
    }
    public static Specification<LabRegistration> withRegistrationDateDetween(Date registrationStartDate, Date registrationEndDate) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.<Date>get("registrationDate"), criteriaBuilder.literal(DateHelper.getStartOfDay(registrationStartDate)), criteriaBuilder.literal(DateHelper.getEndOfDay(registrationEndDate))));
    }

}
