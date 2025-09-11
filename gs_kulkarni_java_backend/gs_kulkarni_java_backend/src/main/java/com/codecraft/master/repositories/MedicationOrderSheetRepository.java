package com.codecraft.master.repositories;

import com.codecraft.master.entities.MedicationOrderSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationOrderSheetRepository extends JpaRepository<MedicationOrderSheet, Integer>, JpaSpecificationExecutor<MedicationOrderSheet> {
    List<MedicationOrderSheet> findByHospitalId(Integer hospitalId);
}