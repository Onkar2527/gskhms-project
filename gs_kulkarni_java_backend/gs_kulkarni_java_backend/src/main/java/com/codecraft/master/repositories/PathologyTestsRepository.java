package com.codecraft.master.repositories;

import com.codecraft.master.entities.PathologyTests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface PathologyTestsRepository extends JpaRepository<PathologyTests, Integer>, JpaSpecificationExecutor<PathologyTests> {
}