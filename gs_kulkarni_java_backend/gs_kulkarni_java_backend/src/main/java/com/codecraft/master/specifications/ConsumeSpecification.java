package com.codecraft.master.specifications;

import com.codecraft.master.entities.Consume;
import org.springframework.data.jpa.domain.Specification;

public class ConsumeSpecification {

    private ConsumeSpecification(){}

    public static Specification<Consume> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
