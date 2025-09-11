package com.codecraft.master.repositories;

import com.codecraft.master.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer>, JpaSpecificationExecutor<Room> {
    List<Room> findByHospitalId(Integer hospitalId);

    List<Room> findByFloorId(Integer id);

    List<Room> findByFloorIdAndStatus(Integer id, String status);
}