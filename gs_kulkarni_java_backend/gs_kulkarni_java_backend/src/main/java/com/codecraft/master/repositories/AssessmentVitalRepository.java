package com.codecraft.master.repositories;

import com.codecraft.master.entities.AssessmentVital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentVitalRepository extends JpaRepository<AssessmentVital, Integer>, JpaSpecificationExecutor<AssessmentVital> {
    List<AssessmentVital> findByHospitalId(Integer hospitalId);

    List<AssessmentVital> findByAppointmentIdOrderByCreatedDateDesc(Integer appointmentId);
}