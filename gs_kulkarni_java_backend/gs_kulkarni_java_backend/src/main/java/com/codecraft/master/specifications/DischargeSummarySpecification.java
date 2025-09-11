package com.codecraft.master.specifications;

import com.codecraft.master.entities.DischargeSummary;
import org.springframework.data.jpa.domain.Specification;

public class DischargeSummarySpecification {

    private DischargeSummarySpecification(){}


    public static Specification<DischargeSummary> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<DischargeSummary> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }


    public static Specification<DischargeSummary> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<DischargeSummary> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
