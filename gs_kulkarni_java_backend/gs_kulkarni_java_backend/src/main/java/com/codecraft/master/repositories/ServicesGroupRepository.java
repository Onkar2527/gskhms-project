package com.codecraft.master.repositories;

import com.codecraft.master.entities.ServiceGroup;
import com.codecraft.master.entities.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ServicesGroupRepository extends JpaRepository<ServiceGroup, Integer> {
    void deleteByGroupId(Integer groupId);

    List<ServiceGroup> findByHospitalId(Integer hospitalId);
}
