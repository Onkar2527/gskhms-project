package com.codecraft.master.specifications;

import com.codecraft.master.entities.Bed;
import com.codecraft.master.entities.PrescriptionDetails;
import org.springframework.data.jpa.domain.Specification;

public class BedSpecification {

    private BedSpecification(){}

    public static Specification<Bed> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
    public static Specification<Bed> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }
    public static Specification<Bed> withRoomId(Integer roomId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("roomId"), roomId));
    }

}
