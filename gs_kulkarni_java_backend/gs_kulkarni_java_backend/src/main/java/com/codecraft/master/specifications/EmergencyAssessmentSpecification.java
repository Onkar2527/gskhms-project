package com.codecraft.master.specifications;

import com.codecraft.master.entities.EmergencyAssessment;
import org.springframework.data.jpa.domain.Specification;

public class EmergencyAssessmentSpecification {

    private EmergencyAssessmentSpecification(){}

    public static Specification<EmergencyAssessment> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<EmergencyAssessment> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<EmergencyAssessment> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<EmergencyAssessment> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<EmergencyAssessment> withPatientId(Integer patientId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }

}
