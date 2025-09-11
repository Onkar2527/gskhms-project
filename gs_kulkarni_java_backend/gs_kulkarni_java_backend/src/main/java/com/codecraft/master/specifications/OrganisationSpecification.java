package com.codecraft.master.specifications;

import com.codecraft.master.entities.Organisation;
import org.springframework.data.jpa.domain.Specification;

public class OrganisationSpecification {

    private OrganisationSpecification(){}

    public static Specification<Organisation> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<Organisation> withType(String type){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type));
    }
    public static Specification<Organisation> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
    public static Specification<Organisation> withCategoryId(Integer categoryId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("categoryId"), categoryId));
    }

}
