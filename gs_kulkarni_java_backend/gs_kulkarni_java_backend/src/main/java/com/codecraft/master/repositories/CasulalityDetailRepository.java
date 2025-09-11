package com.codecraft.master.repositories;

import com.codecraft.master.entities.CasualityDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasulalityDetailRepository extends JpaRepository<CasualityDetail, Integer>, JpaSpecificationExecutor<CasualityDetail> {
    List<CasualityDetail> findByCasualtyId(Integer id);
}