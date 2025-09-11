package com.codecraft.master.repositories;

import com.codecraft.master.entities.LabTestDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabTestDetailsRepository extends JpaRepository<LabTestDetails, Integer>, JpaSpecificationExecutor<LabTestDetails> {
    List<LabTestDetails> findByTestHeaderId(Integer id);
}