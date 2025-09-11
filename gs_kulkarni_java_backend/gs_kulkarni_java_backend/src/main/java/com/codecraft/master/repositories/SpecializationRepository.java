package com.codecraft.master.repositories;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, Integer>, JpaSpecificationExecutor<Specialization> {
    List<Specialization> findByHospitalId(Integer hospitalId);
}
