package com.codecraft.master.repositories;

import com.codecraft.master.entities.OperationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OperationStatusRepository extends JpaRepository<OperationStatus, Integer>, JpaSpecificationExecutor<OperationStatus> {
    List<OperationStatus> findByHospitalId(Integer hospitalId);

    Optional<OperationStatus> findByOperationId(Integer operationId);
}