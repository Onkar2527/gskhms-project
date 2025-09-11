package com.codecraft.master.repositories;

import com.codecraft.master.entities.BedFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedFacilityRepository extends JpaRepository<BedFacility, Integer>, JpaSpecificationExecutor<BedFacility> {
    List<BedFacility> findByHospitalId(Integer hospitalId);

    List<BedFacility> findByAppointmentId(Integer appointmentId);
}