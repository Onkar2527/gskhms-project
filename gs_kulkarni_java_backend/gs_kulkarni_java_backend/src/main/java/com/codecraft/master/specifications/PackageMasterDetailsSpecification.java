package com.codecraft.master.specifications;

import com.codecraft.master.entities.PackageMasterDetails;
import org.springframework.data.jpa.domain.Specification;


public class PackageMasterDetailsSpecification {

    private PackageMasterDetailsSpecification(){}


    public static Specification<PackageMasterDetails> withId(Integer id){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<PackageMasterDetails> withPackageId(Integer packageId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("packageId"), packageId));
    }

    public static Specification<PackageMasterDetails> withServiceId(Integer serviceId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("serviceId"), serviceId));
    }
    public static Specification<PackageMasterDetails> withType(Integer type){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type));
    }

    public static Specification<PackageMasterDetails> withIsActive(Integer activeInd) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), activeInd));
    }
    
    public static Specification<PackageMasterDetails> withRate(Integer charges) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("charges"), charges));
    }
}
