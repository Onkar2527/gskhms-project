package com.codecraft.master.specifications;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.Payment;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.Calendar;
import java.util.Date;

public class PaymentSpecification {

    private PaymentSpecification(){}

    public static Specification<Payment> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }


    public static Specification<Payment> withPaymentDate(Date paymentDate){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("paymentDate"), DateHelper.getStartOfDay(paymentDate), DateHelper.getEndOfDay(paymentDate)));
    }

    public static Specification<Payment> withIsActive(Integer activeInd) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), activeInd));
    }

    public static Specification<Payment> withPaymentStatus(String paymentStatus) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("paymentStatus"), paymentStatus));
    }

    public static Specification<Payment> withIsServicePayment(Boolean isServicePayment) {
        if(isServicePayment){
            return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("isServicePayment"), isServicePayment));
        }else{
            return ((root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("isServicePayment")));
        }
    }
    public static Specification<Payment> withPaymentDateLessThan(Date date){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.lessThanOrEqualTo(root.<Date>get("paymentDate"), DateHelper.getEndOfDay(date)));
    }

    public static Specification<Payment> withPaymentDateGreaterThan(Date date){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.<Date>get("paymentDate"), DateHelper.getStartOfDay(date)));
    }

    public static Specification<Payment> withAppointmentId(Integer appointmentId) {
        return new Specification<>() {
            public Predicate toPredicate(Root<Payment> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Join<Payment, Appointment> userProd = root.join("appointment");
                return cb.equal(userProd.get("id"),appointmentId);
            }
        };

    }
    public static Specification<Payment> withPaymentDateDetween(Date paymentStartDate, Date paymentEndDate){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.<Date>get("paymentDate"), criteriaBuilder.literal(DateHelper.getStartOfDay(paymentStartDate)), criteriaBuilder.literal(DateHelper.getEndOfDay(paymentEndDate))));
    }

    public static Specification<Payment> joinFirstName(String input) {
        return new Specification<>() {
            public Predicate toPredicate(Root<Payment> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Join<Payment, Appointment> userProd = root.join("appointment");
                return cb.like(userProd.get("firstName"), "%" + input + "%");
            }
        };
    }

    public static Specification<Payment> joinLastName(String input) {
        return new Specification<>() {
            public Predicate toPredicate(Root<Payment> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Join<Payment, Appointment> userProd = root.join("appointment");
                return cb.like(userProd.get("lastName"), "%" + input + "%");
            }
        };
    }

    public static Specification<Payment> joinType(String input) {
        return new Specification<>() {
            public Predicate toPredicate(Root<Payment> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Join<Payment, Appointment> userProd = root.join("appointment");
                return cb.like(userProd.get("type"), "%" + input + "%");
            }
        };
    }

}
