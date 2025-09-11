package com.codecraft.master.repositories;

import com.codecraft.master.entities.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Integer>, JpaSpecificationExecutor<Floor> {
    List<Floor> findByHospitalId(Integer hospitalId);

    List<Floor> findByHospitalIdAndStatus(Integer hospitalId, String status);
}