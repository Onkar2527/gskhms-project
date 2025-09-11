package com.codecraft.master.specifications;

import com.codecraft.master.entities.ClinicalAssessment;
import org.springframework.data.jpa.domain.Specification;

public class ClinicalAssessmentSpecification {

    private ClinicalAssessmentSpecification(){}

    public static Specification<ClinicalAssessment> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<ClinicalAssessment> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<ClinicalAssessment> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<ClinicalAssessment> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<ClinicalAssessment> withPatientId(Integer patientId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }


}
