package com.codecraft.master.repositories;

import com.codecraft.master.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer>, JpaSpecificationExecutor<Appointment> {
    List<Appointment> findByHospitalId(Integer hospitalId);

    @Query("select count( a) from Appointment a where a.hospitalId = :hospitalId AND  a.appointmentDate >= :creationDateTime AND  a.appointmentDate <= :creationDateTimeEnd")
    long countByHospitalIdAndAppointmentDate(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd);

    @Query("select count( a) from Appointment a where a.hospitalId = :hospitalId AND  a.appointmentDate >= :creationDateTime  AND  a.appointmentDate <= :creationDateTimeEnd AND a.serviceId = :serviceId")
    long countByHospitalIdAndAppointmentDateAndServiceId(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, Integer serviceId);

    @Query("select count( a) from Appointment a where a.hospitalId = :hospitalId AND  a.appointmentDate >= :creationDateTime AND  a.appointmentDate <= :creationDateTimeEnd AND a.status = :status")
    long countByHospitalIdAndAppointmentDateAndStatus(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, String status);

    @Query("select count( a) from Appointment a where a.hospitalId = :hospitalId AND  a.appointmentDate >= :creationDateTime  AND  a.appointmentDate <= :creationDateTimeEnd AND a.serviceId = :serviceId AND a.status = :status")
    long countByHospitalIdAndAppointmentDateAndServiceIdAndStatus(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, Integer serviceId, String status);

    @Query("select count( a) from Appointment a where a.hospitalId = :hospitalId AND  a.appointmentDate >= :creationDateTime AND  a.appointmentDate <= :creationDateTimeEnd AND a.doctorId = :doctorId")
    Long countByHospitalIdAndAppointmentDateAndDoctorId(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, Integer doctorId);

    @Query("select a.id from Appointment a where a.hospitalId = :hospitalId AND  a.appointmentDate >= :creationDateTime AND  a.appointmentDate <= :creationDateTimeEnd AND a.doctorId = :doctorId")
    List<Integer> findByHospitalIdAndAppointmentDateAndDoctorId(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, Integer doctorId);

    @Query("select count( a) from Appointment a where a.hospitalId = :hospitalId AND  a.appointmentDate >= :creationDateTime AND  a.appointmentDate <= :creationDateTimeEnd AND a.doctorId = :doctorId AND a.status = :status")
    Long countByHospitalIdAndAppointmentDateAndDoctorIdAndStatus(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, Integer doctorId, String status);

    @Query("select a from Appointment a where a.hospitalId = :hospitalId AND  a.appointmentDate >= :creationDateTime AND  a.appointmentDate <= :creationDateTimeEnd AND a.doctorId = :doctorId")
    List<Appointment> findAppointmentByHospitalIdAndAppointmentDateAndDoctorId(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, Integer doctorId);

}
