package com.codecraft.master.specifications;

import com.codecraft.master.entities.PrescriptionDetailsAfter;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class PrescriptionDetailsSpecificationAfter {

    private PrescriptionDetailsSpecificationAfter(){}

    public static Specification<PrescriptionDetailsAfter> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<PrescriptionDetailsAfter> withAppointmentId(Integer appointmentId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<PrescriptionDetailsAfter> withIsActive(Integer activeInd) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), activeInd));
    }

    public static Specification<PrescriptionDetailsAfter> withPrescriptionDate(Date prescriptionDate) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("prescriptionDate"), prescriptionDate));
    }

    public static Specification<PrescriptionDetailsAfter> withDoctorId(Integer doctorId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("doctorId"), doctorId));
    }
}
