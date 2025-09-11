package com.codecraft.master.repositories;

import com.codecraft.master.entities.LabTestHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabTestHeaderRepository extends JpaRepository<LabTestHeader, Integer>, JpaSpecificationExecutor<LabTestHeader> {
    List<LabTestHeader> findByRegistrationId(Integer registrationId);
}