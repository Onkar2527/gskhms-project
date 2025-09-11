package com.codecraft.master.specifications;

import com.codecraft.master.entities.MedicationOrderSheet;
import org.springframework.data.jpa.domain.Specification;

public class MedicationOrderSheetSpecification {

    private MedicationOrderSheetSpecification(){}

    public static Specification<MedicationOrderSheet> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<MedicationOrderSheet> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<MedicationOrderSheet> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<MedicationOrderSheet> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<MedicationOrderSheet> withPatientId(Integer patientId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }


}
