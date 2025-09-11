package com.codecraft.master.repositories;

import com.codecraft.master.entities.Bed;
import com.codecraft.master.entities.DischargeSummary;
import com.codecraft.master.entities.DocumentNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DischargeSummaryRepository extends JpaRepository<DischargeSummary, Integer>, JpaSpecificationExecutor<DischargeSummary> {
    List<DischargeSummary> findByHospitalId(Integer hospitalId);

}