package com.codecraft.master.repositories;

import com.codecraft.master.entities.ClinicalAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClinicalAssessmentRepository extends JpaRepository<ClinicalAssessment, Integer>, JpaSpecificationExecutor<ClinicalAssessment> {
    List<ClinicalAssessment> findByHospitalId(Integer hospitalId);

    Optional<ClinicalAssessment> findByAppointmentId(Integer id);
}