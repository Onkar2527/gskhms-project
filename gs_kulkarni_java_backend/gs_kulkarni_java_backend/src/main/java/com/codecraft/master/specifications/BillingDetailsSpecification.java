package com.codecraft.master.specifications;

import com.codecraft.master.entities.BillingClass;
import com.codecraft.master.entities.BillingDetails;
import org.springframework.data.jpa.domain.Specification;

public class BillingDetailsSpecification {

    private BillingDetailsSpecification(){}

    public static Specification<BillingDetails> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
