package com.codecraft.master.specifications;

import com.codecraft.master.entities.PathologyTests;
import org.springframework.data.jpa.domain.Specification;


public class PathologyTestsSpecification {

    private PathologyTestsSpecification(){}

    public static Specification<PathologyTests> withType(String type){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type));
    }

    public static Specification<PathologyTests> withId(Integer id){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<PathologyTests> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<PathologyTests> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
