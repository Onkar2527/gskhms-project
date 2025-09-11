package com.codecraft.master.specifications;

import com.codecraft.master.entities.TemplateDetails;
import org.springframework.data.jpa.domain.Specification;

public class TemplateDetailsSpecification {

    private TemplateDetailsSpecification(){}

    public static Specification<TemplateDetails> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
