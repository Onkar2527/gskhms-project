package com.codecraft.master.specifications;

import com.codecraft.master.entities.PackageMaster;
import com.codecraft.master.entities.PathologyTests;
import org.springframework.data.jpa.domain.Specification;


public class PackageMasterSpecification {

    private PackageMasterSpecification(){}

    public static Specification<PackageMaster> withName(String name){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name));
    }

    public static Specification<PackageMaster> withId(Integer id){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), id));
    }

    public static Specification<PackageMaster> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<PackageMaster> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));

    }

    public static Specification<PackageMaster> withDeptId(Integer deptId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("deptId"), deptId));
    }
}
