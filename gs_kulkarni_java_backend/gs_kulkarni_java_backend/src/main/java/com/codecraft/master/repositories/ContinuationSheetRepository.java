package com.codecraft.master.repositories;

import com.codecraft.master.entities.AssessmentVital;
import com.codecraft.master.entities.ContinuationSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContinuationSheetRepository extends JpaRepository<ContinuationSheet, Integer>, JpaSpecificationExecutor<ContinuationSheet> {
    List<ContinuationSheet> findByHospitalId(Integer hospitalId);

}