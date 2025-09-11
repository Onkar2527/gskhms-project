package com.codecraft.master.specifications;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.GTemplate;
import org.springframework.data.jpa.domain.Specification;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class GTemplateSpecification {

    private GTemplateSpecification(){}

    public static Specification<GTemplate> withIsActive(Integer isActive) {
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("activeInd"), isActive));
    }
}
