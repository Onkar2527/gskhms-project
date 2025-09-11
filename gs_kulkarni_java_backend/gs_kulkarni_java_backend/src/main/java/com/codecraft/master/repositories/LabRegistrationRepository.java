package com.codecraft.master.repositories;

import com.codecraft.master.entities.LabRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabRegistrationRepository extends JpaRepository<LabRegistration, Integer>, JpaSpecificationExecutor<LabRegistration> {
    List<LabRegistration> findAllByActiveInd(Integer activeInd);
}