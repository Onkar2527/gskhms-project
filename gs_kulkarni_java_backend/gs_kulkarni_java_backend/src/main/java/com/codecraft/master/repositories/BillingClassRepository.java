package com.codecraft.master.repositories;

import com.codecraft.master.entities.BillingClass;
import com.codecraft.master.entities.Floor;
import com.codecraft.master.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingClassRepository extends JpaRepository<BillingClass, Integer>, JpaSpecificationExecutor<BillingClass> {
    List<BillingClass> findByHospitalId(Integer hospitalId);
    List<BillingClass> findByHospitalIdAndStatus(Integer hospitalId, String status);
}