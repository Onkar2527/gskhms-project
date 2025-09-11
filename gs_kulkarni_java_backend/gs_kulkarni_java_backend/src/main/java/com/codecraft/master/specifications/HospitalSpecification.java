package com.codecraft.master.specifications;

import com.codecraft.master.entities.Hospital;
import org.springframework.data.jpa.domain.Specification;


public class HospitalSpecification {

    private HospitalSpecification(){}

    public static Specification<Hospital> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("id"), hospitalId));
    }

    public static Specification<Hospital> withEmail(String emailId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("email"), emailId));
    }

    public static Specification<Hospital> withName(String name){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("name"), name));
    }

    public static Specification<Hospital> withActiveInd(Integer activeInd){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), activeInd));
    }


}
