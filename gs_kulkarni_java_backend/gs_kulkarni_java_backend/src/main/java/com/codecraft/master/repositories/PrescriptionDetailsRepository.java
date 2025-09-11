package com.codecraft.master.repositories;

import com.codecraft.master.entities.PrescriptionDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionDetailsRepository extends JpaRepository<PrescriptionDetails, Integer>, JpaSpecificationExecutor<PrescriptionDetails> {
    List<PrescriptionDetails> findByHospitalId(Integer hospitalId);
}
