package com.codecraft.master.repositories;

import com.codecraft.master.entities.AnesthesiaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnesthesiaTypeRepository extends JpaRepository<AnesthesiaType, Integer>, JpaSpecificationExecutor<AnesthesiaType> {
    List<AnesthesiaType> findByHospitalId(Integer hospitalId);

}