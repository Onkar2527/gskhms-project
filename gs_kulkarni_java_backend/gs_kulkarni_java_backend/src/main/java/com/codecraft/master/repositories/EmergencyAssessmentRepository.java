package com.codecraft.master.repositories;

import com.codecraft.master.entities.EmergencyAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface EmergencyAssessmentRepository extends JpaRepository<EmergencyAssessment, Integer>, JpaSpecificationExecutor<EmergencyAssessment> {
    List<EmergencyAssessment> findByHospitalId(Integer hospitalId);

    List<EmergencyAssessment>  findByAppointmentId(Integer id);
}