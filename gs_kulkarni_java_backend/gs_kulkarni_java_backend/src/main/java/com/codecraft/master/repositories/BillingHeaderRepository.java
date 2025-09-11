package com.codecraft.master.repositories;

import com.codecraft.master.entities.BillingHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BillingHeaderRepository extends JpaRepository<BillingHeader, Integer>, JpaSpecificationExecutor<BillingHeader> {
    List<BillingHeader> findByHospitalId(Integer hospitalId);

    @Query("select a from BillingHeader a where a.hospitalId = :hospitalId AND  a.billingDate >= :creationDateTime  AND  a.billingDate <= :creationDateTimeEnd")
    List<BillingHeader> findTodaysBillsByHospitalId(Date creationDateTime, Date creationDateTimeEnd, Integer hospitalId);

    @Query("select a from BillingHeader a where a.hospitalId = :hospitalId AND a.billingDate <= :creationDateTime")
    List<BillingHeader> findTodaysBillsByHospitalIdPast(Date creationDateTime, Integer hospitalId);
}