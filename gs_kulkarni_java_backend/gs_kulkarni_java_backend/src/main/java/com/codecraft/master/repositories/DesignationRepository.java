package com.codecraft.master.repositories;

import com.codecraft.master.entities.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Integer> {
    List<Designation> findByHospitalId(Integer hospitalId);
}
