package com.codecraft.master.repositories;

import com.codecraft.master.entities.AppointmentBedAssign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentBedAssignRepository extends JpaRepository<AppointmentBedAssign, Integer>, JpaSpecificationExecutor<AppointmentBedAssign> {
    List<AppointmentBedAssign> findByHospitalId(Integer hospitalId);

    Optional<AppointmentBedAssign> findByAppointmentIdAndStatus(Integer appointmentId, String status);

    Optional<AppointmentBedAssign> findByBedIdAndStatus(Integer bedId, String status);
}