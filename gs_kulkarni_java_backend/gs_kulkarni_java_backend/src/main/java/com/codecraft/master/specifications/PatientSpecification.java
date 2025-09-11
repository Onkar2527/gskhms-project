package com.codecraft.master.specifications;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.Patient;
import org.springframework.data.jpa.domain.Specification;

public class PatientSpecification {

    private PatientSpecification(){}

    public static Specification<Patient> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<Patient> withMobileNumber(String mobileNumber){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("mobileNumber"), mobileNumber));
    }

    public static Specification<Patient> withState(String state){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("state"), state));
    }

    public static Specification<Patient> withIsActive(Integer activeInd) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), activeInd));
    }

    public static Specification<Patient> withFirstName(String firstName) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("firstName"), "%"+firstName+"%"));
    }

    public static Specification<Patient> withLastName(String lastName) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("lastName"), "%"+lastName+"%"));
    }

}
