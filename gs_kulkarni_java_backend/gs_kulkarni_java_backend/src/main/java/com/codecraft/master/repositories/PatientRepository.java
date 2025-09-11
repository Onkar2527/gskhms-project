package com.codecraft.master.repositories;

import com.codecraft.master.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer>, JpaSpecificationExecutor<Patient> {
    List<Patient> findByHospitalId(Integer hospitalId);

    Optional<Patient> findByPatientId(Integer patientId);

    Optional<Patient> findByHospitalIdAndMobileNumberAndFirstNameAndLastName(Integer hospitalId, String mobileNumber, String firstName, String lastName);
}
