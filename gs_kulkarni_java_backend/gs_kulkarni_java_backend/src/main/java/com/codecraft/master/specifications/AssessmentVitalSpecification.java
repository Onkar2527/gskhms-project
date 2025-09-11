package com.codecraft.master.specifications;

import com.codecraft.master.entities.AssessmentVital;
import com.codecraft.master.entities.ContinuationSheet;
import org.springframework.data.jpa.domain.Specification;

public class AssessmentVitalSpecification {

    private AssessmentVitalSpecification(){}

    public static Specification<AssessmentVital> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<AssessmentVital> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<AssessmentVital> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<AssessmentVital> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }


}
