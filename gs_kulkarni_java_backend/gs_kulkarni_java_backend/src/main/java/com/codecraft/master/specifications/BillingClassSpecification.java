package com.codecraft.master.specifications;

import com.codecraft.master.entities.BillingClass;
import org.springframework.data.jpa.domain.Specification;

public class BillingClassSpecification {

    private BillingClassSpecification(){}

    public static Specification<BillingClass> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
