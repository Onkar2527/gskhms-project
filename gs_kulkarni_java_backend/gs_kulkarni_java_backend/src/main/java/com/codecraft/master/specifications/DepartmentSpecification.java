package com.codecraft.master.specifications;

import com.codecraft.master.entities.Department;
import org.springframework.data.jpa.domain.Specification;

public class DepartmentSpecification {

    private DepartmentSpecification(){}

    public static Specification<Department> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
