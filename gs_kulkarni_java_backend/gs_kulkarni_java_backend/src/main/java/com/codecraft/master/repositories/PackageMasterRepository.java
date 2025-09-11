package com.codecraft.master.repositories;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.PackageMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PackageMasterRepository extends JpaRepository<PackageMaster, Integer>, JpaSpecificationExecutor<PackageMaster> {
}
