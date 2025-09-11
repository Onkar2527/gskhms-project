package com.codecraft.master.repositories;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer>, JpaSpecificationExecutor<Payment> {
    List<Payment> findByHospitalId(Integer hospitalId);

    List<Payment> findByBillingId(Integer billingId);

    List<Payment> findByAppointment(Appointment appointment);

    Optional<Payment> findByAppointmentAndDocumentNumber(Appointment appointment, String paymentNumber);

    @Query("select sum( a.amount) from Payment a where a.hospitalId = :hospitalId AND  a.paymentDate >= :creationDateTime AND  a.paymentDate <= :creationDateTimeEnd AND a.paymentStatus = :paid")
    Double sumByHospitalIdAndPaymentDateAndPaymentStatus(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, String paid);


    @Query("select sum( a.amount) from Payment a where a.hospitalId = :hospitalId AND  a.paymentDate >= :creationDateTime AND  a.paymentDate <= :creationDateTimeEnd AND a.paymentStatus = :paid AND a.paymentMode = :paymentMode")
    Double sumByHospitalIdAndPaymentDateAndPaymentStatusAndPaymentMode(Integer hospitalId, Date creationDateTime, Date creationDateTimeEnd, String paid, String paymentMode);

    @Query("select sum( a.amount) from Payment a where a.hospitalId = :hospitalId AND a.appointment IN :appointmentIds AND a.serviceId IN :serviceIds AND a.paymentDate >= :creationDateTime AND  a.paymentDate <= :creationDateTimeEnd AND a.paymentStatus = :paid")
    Double sumByHospitalIdAndAppointmentIdInAndServiceIdInAndPaymentDateAndPaymentStatus(Integer hospitalId, List<Appointment> appointmentIds, List<Integer> serviceIds, Date creationDateTime, Date creationDateTimeEnd, String paid);
}
