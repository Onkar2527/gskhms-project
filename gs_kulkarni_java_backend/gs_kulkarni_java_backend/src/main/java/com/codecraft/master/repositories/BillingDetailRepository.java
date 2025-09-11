package com.codecraft.master.repositories;

import com.codecraft.master.entities.BillingDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingDetailRepository extends JpaRepository<BillingDetails, Integer> {
    List<BillingDetails> findByBillingId(Integer billingId);
}