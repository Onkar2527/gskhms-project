package com.codecraft.master.repositories;

import com.codecraft.master.entities.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer>, JpaSpecificationExecutor<RoomType> {
    List<RoomType> findByHospitalId(Integer hospitalId);
}