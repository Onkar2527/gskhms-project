package com.codecraft.master.repositories;

import com.codecraft.master.entities.OTRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OTRegistrationRepository extends JpaRepository<OTRegistration, Integer>, JpaSpecificationExecutor<OTRegistration> {
    List<OTRegistration> findByHospitalId(Integer hospitalId);
}