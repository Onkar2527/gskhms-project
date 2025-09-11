package com.codecraft.master.specifications;

import com.codecraft.master.entities.OrganisationCategory;
import org.springframework.data.jpa.domain.Specification;

public class OrganisationCategorySpecification {

    private OrganisationCategorySpecification(){}

    public static Specification<OrganisationCategory> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<OrganisationCategory> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
