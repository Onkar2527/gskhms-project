package com.codecraft.master.repositories;

import com.codecraft.master.entities.AppointmentServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentServiceRepository extends JpaRepository<AppointmentServiceEntity, Integer>, JpaSpecificationExecutor<AppointmentServiceEntity> {
    Optional<AppointmentServiceEntity> findByServiceIdAndTypeAndAppointmentId(Integer serviceId, String type, Integer appointmentId);


    List<AppointmentServiceEntity> findByTypeAndAppointmentIdAndLabNoGenerated(String T, Integer appointmentId, String n);

    Optional<AppointmentServiceEntity> findByServiceIdAndTypeAndAppointmentIdAndCharges(Integer serviceId, String packageType, Integer appointmentId, Double charges);
}