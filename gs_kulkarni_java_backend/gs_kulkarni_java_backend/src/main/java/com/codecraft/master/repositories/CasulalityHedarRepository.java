package com.codecraft.master.repositories;

import com.codecraft.master.entities.CasualityHeader;
import com.codecraft.master.entities.PackageMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CasulalityHedarRepository extends JpaRepository<CasualityHeader, Integer>, JpaSpecificationExecutor<CasualityHeader> {
}
