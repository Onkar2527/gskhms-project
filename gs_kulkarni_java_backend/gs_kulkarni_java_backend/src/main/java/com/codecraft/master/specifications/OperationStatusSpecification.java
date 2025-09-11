package com.codecraft.master.specifications;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.OperationStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class OperationStatusSpecification {

    private OperationStatusSpecification(){}

    public static Specification<OperationStatus> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<OperationStatus> withOtRegistrationId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("operationId"), id));
    }

    public static Specification<OperationStatus> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<OperationStatus> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<OperationStatus> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<OperationStatus> withOperationDateBetween(Date startDate, Date endDate){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.<Date>get("startDateTime"), criteriaBuilder.literal(DateHelper.getStartOfDay(startDate)), criteriaBuilder.literal(DateHelper.getEndOfDay(endDate))));
    }
}
