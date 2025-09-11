package com.codecraft.master.specifications;

import com.codecraft.master.entities.Employee;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecification {

    private EmployeeSpecification(){}

    public static Specification<Employee> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<Employee> withMobileNumber(String mobileNumber){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("mobileNumber"), mobileNumber));
    }

    public static Specification<Employee> withEmailId(String emailId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("emailId"), emailId));
    }

    public static Specification<Employee> withType(String type){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("userType"), type));
    }

    public static Specification<Employee> withStatus(String status){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status));
    }

    public static Specification<Employee> withEmployeeId(Integer employeeId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("employeeId"), employeeId));
    }

    public static Specification<Employee> withActiveInd(Integer activeInd) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), activeInd));
    }

    public static Specification<Employee> withNotType(String type) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.notEqual(root.get("userType"), type));
    }
}