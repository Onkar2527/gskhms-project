package com.codecraft.master.repositories;

import com.codecraft.master.entities.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankRepository extends JpaRepository<Bank, Integer>, JpaSpecificationExecutor<Bank> {
    List<Bank> findByHospitalId(Integer hospitalId);

    void deleteByBankId(Integer bankId);
}