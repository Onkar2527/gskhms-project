package com.codecraft.master.specifications;

import com.codecraft.master.entities.NursingNotes;
import org.springframework.data.jpa.domain.Specification;

public class NursingNotesSpecification {

    private NursingNotesSpecification(){}

    public static Specification<NursingNotes> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<NursingNotes> withHospitalId(Integer hospitalId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<NursingNotes> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<NursingNotes> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<NursingNotes> withPatientId(Integer patientId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }


}
