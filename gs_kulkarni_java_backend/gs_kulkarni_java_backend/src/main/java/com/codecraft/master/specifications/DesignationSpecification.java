package com.codecraft.master.specifications;

import com.codecraft.master.entities.Designation;
import org.springframework.data.jpa.domain.Specification;

public class DesignationSpecification {

    private DesignationSpecification(){}

    public static Specification<Designation> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
