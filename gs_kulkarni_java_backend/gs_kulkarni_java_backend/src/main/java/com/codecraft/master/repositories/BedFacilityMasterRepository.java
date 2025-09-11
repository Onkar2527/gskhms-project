package com.codecraft.master.repositories;

import com.codecraft.master.entities.BedFacility;
import com.codecraft.master.entities.BedFacilityMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedFacilityMasterRepository extends JpaRepository<BedFacilityMaster, Integer>, JpaSpecificationExecutor<BedFacilityMaster> {
    List<BedFacilityMaster> findByHospitalId(Integer hospitalId);

}