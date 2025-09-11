package com.codecraft.master.repositories;

import com.codecraft.master.entities.PayoutDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PayoutDetailsRepository extends JpaRepository<PayoutDetails, Integer>, JpaSpecificationExecutor<PayoutDetails> {
    Optional<PayoutDetails> findByEmployeeId(Integer employeeId);
}