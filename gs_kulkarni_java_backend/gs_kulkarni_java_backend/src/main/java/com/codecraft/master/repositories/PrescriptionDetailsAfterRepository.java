
package com.codecraft.master.repositories;

import com.codecraft.master.entities.PrescriptionDetailsAfter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionDetailsAfterRepository extends JpaRepository<PrescriptionDetailsAfter, Integer>, JpaSpecificationExecutor<PrescriptionDetailsAfter> {
    List<PrescriptionDetailsAfter> findByHospitalId(Integer hospitalId);
}
