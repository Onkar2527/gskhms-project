package com.codecraft.master.specifications;

import com.codecraft.master.entities.AppointmentBedAssign;
import org.springframework.data.jpa.domain.Specification;

public class AppointmentBedAssignSpecification {

    private AppointmentBedAssignSpecification(){}

    public static Specification<AppointmentBedAssign> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<AppointmentBedAssign> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<AppointmentBedAssign> withBedId(Integer bedId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("bedId"), bedId));
    }

    public static Specification<AppointmentBedAssign> withStatus(String status) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status));
    }
}
