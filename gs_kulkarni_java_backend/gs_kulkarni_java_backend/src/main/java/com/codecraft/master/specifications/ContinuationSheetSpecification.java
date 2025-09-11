package com.codecraft.master.specifications;

import com.codecraft.master.entities.ContinuationSheet;
import com.codecraft.master.entities.MedicationOrderSheet;
import org.springframework.data.jpa.domain.Specification;

public class ContinuationSheetSpecification {

    private ContinuationSheetSpecification(){}

    public static Specification<ContinuationSheet> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<ContinuationSheet> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<ContinuationSheet> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<ContinuationSheet> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<ContinuationSheet> withPatientId(Integer patientId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }


}
