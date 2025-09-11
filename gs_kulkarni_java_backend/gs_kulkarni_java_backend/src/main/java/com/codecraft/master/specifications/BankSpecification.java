package com.codecraft.master.specifications;

import com.codecraft.master.entities.Bank;
import org.springframework.data.jpa.domain.Specification;

public class BankSpecification {

    private BankSpecification(){}

    public static Specification<Bank> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
