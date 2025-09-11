package com.codecraft.master.specifications;

import com.codecraft.master.entities.BedFacility;
import org.springframework.data.jpa.domain.Specification;

public class BedFaciliySpecification {

    private BedFaciliySpecification(){}

    public static Specification<BedFacility> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
    public static Specification<BedFacility> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }
    public static Specification<BedFacility> withAppointmentId(Integer appointmentId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

}
