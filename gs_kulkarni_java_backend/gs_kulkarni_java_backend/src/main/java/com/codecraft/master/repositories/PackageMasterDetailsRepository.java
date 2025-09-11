package com.codecraft.master.repositories;

import com.codecraft.master.entities.PackageMasterDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageMasterDetailsRepository extends JpaRepository<PackageMasterDetails, Integer>, JpaSpecificationExecutor<PackageMasterDetails> {
    List<PackageMasterDetails> findByPackageId(Integer serviceId);
}
