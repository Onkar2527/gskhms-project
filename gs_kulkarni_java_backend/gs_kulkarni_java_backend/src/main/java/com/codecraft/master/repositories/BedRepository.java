package com.codecraft.master.repositories;

import com.codecraft.master.entities.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedRepository extends JpaRepository<Bed, Integer>, JpaSpecificationExecutor<Bed> {
    List<Bed> findByHospitalId(Integer hospitalId);

    List<Bed> findByRoomId(Integer id);

    List<Bed> findByRoomIdAndStatus(Integer id, String status);
}