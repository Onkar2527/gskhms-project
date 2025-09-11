package com.codecraft.master.specifications;

import com.codecraft.master.entities.BillingHeader;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class BillingHeaderSpecification {

    private BillingHeaderSpecification(){}



    public static Specification<BillingHeader> withHospitalId(Integer hospitalId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("hospitalId"), hospitalId));
    }

    public static Specification<BillingHeader> withBillDate(Date billDate){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("billingDate"), DateHelper.getStartOfDay(billDate), DateHelper.getEndOfDay(billDate)));
    }


    public static Specification<BillingHeader> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
    public static Specification<BillingHeader> withBillDateLessThan(Date date){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("billingDate"), DateHelper.getStartOfDay(date)));
    }

    public static Specification<BillingHeader> withBillDateGreaterThan(Date date){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("billingDate"), DateHelper.getEndOfDay(date)));
    }

    public static Specification<BillingHeader> withPaymentDateBetween(Date billingStartDate, Date billingEndDate) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.<Date>get("billingDate"), criteriaBuilder.literal(DateHelper.getStartOfDay(billingStartDate)), criteriaBuilder.literal(DateHelper.getEndOfDay(billingEndDate))));
    }

    public static Specification<BillingHeader> withAppointmentId(Integer appointmentId) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appointmentId"), appointmentId));
    }
}
