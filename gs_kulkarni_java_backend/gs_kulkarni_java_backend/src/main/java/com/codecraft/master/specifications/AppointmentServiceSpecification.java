package com.codecraft.master.specifications;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.AppointmentServiceEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

public class AppointmentServiceSpecification {

    private AppointmentServiceSpecification(){}


    public static Specification<AppointmentServiceEntity> withAppointmentId(Integer appointmentId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }

    public static Specification<AppointmentServiceEntity> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }

    public static Specification<AppointmentServiceEntity> withType(String type) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type));
    }

    public static Specification<AppointmentServiceEntity> withPackageType(String type) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("packageType"), type));
    }

    public static Specification<AppointmentServiceEntity> withAppointmentNumberGenerated(String labNoGenerated) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("labNoGenerated"), labNoGenerated));
    }
}