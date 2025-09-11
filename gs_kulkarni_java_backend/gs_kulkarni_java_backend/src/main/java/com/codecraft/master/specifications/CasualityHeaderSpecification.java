package com.codecraft.master.specifications;

import com.codecraft.master.entities.CasualityHeader;
import com.codecraft.master.entities.Consume;
import org.springframework.data.jpa.domain.Specification;

public class CasualityHeaderSpecification {

    private CasualityHeaderSpecification(){}

    public static Specification<CasualityHeader> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<CasualityHeader> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<CasualityHeader> withPatientId(Integer patientId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("patientId"), patientId));
    }

    public static Specification<CasualityHeader> withId(Integer id) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }
}
