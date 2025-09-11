package com.codecraft.master.specifications;

import com.codecraft.master.entities.PrescriptionDetails;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class PrescriptionDetailsSpecification {

    private PrescriptionDetailsSpecification(){}

    public static Specification<PrescriptionDetails> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<PrescriptionDetails> withAppointmentId(Integer appointmentId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<PrescriptionDetails> withIsActive(Integer activeInd) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), activeInd));
    }

    public static Specification<PrescriptionDetails> withPrescriptionDate(Date prescriptionDate) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("prescriptionDate"), prescriptionDate));
    }

    public static Specification<PrescriptionDetails> withDoctorId(Integer doctorId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("doctorId"), doctorId));
    }
}
