package com.codecraft.master.repositories;

import com.codecraft.master.entities.OTMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OTMasterRepository extends JpaRepository<OTMaster, Integer>, JpaSpecificationExecutor<OTMaster> {
    List<OTMaster> findByHospitalId(Integer hospitalId);
}