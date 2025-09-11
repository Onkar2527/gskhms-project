package com.codecraft.master.repositories;

import com.codecraft.master.entities.PathologyTestsAgeRange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PathologyTestAgeRangeRepository extends JpaRepository<PathologyTestsAgeRange, Integer> , JpaSpecificationExecutor<PathologyTestsAgeRange> {
    List<PathologyTestsAgeRange> findByPathalogyTestDtlId(Integer pathalogyTestDtlId);
}

