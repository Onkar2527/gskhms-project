package com.codecraft.master.repositories;

import com.codecraft.master.entities.PathologyTestDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PathologyTestDetailsRepository extends JpaRepository<PathologyTestDetails, Integer> , JpaSpecificationExecutor<PathologyTestDetails> {
    List<PathologyTestDetails> findByPathologyTestId(Integer pathologyTestId);
}