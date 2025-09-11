package com.codecraft.master.repositories;

import com.codecraft.master.entities.ServiceRate;
import com.codecraft.master.entities.ServiceRateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ServiceRateRepository extends JpaRepository<ServiceRate, ServiceRateId> {

    List<ServiceRate> findByEmployeeId(Integer employeeId);
}
