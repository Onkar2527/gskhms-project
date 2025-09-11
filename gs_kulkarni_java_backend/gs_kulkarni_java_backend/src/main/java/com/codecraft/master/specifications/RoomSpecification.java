package com.codecraft.master.specifications;

import com.codecraft.master.entities.Bed;
import com.codecraft.master.entities.PrescriptionDetails;
import com.codecraft.master.entities.Room;
import org.springframework.data.jpa.domain.Specification;

public class RoomSpecification {

    private RoomSpecification(){}

    public static Specification<Room> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
    public static Specification<Room> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }
    public static Specification<Room> withFloorId(Integer floorId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("floorId"), floorId));
    }
}
