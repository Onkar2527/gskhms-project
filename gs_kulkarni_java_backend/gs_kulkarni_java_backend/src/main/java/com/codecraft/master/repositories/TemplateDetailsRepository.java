package com.codecraft.master.repositories;

import com.codecraft.master.entities.TemplateDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateDetailsRepository extends JpaRepository<TemplateDetails, Integer>, JpaSpecificationExecutor<TemplateDetails> {
}