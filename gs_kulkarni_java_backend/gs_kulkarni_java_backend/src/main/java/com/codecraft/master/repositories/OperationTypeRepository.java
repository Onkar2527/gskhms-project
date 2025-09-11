package com.codecraft.master.repositories;

import com.codecraft.master.entities.OperationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OperationTypeRepository extends JpaRepository<OperationType, Integer>, JpaSpecificationExecutor<OperationType> {
    List<OperationType> findByHospitalId(Integer hospitalId);
}