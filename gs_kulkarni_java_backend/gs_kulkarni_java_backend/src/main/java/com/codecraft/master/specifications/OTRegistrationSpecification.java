package com.codecraft.master.specifications;

import com.codecraft.master.entities.OTRegistration;
import com.codecraft.master.entities.OperationStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class OTRegistrationSpecification {

    private OTRegistrationSpecification(){}

    public static Specification<OTRegistration> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<OTRegistration> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<OTRegistration> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<OTRegistration> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<OTRegistration> withPatientId(Integer patientId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }
    public static Specification<OTRegistration> withOperationDateBetween(Date startDate, Date endDate){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.<Date>get("inDate"), criteriaBuilder.literal(DateHelper.getStartOfDay(startDate)), criteriaBuilder.literal(DateHelper.getEndOfDay(endDate))));
    }
}
