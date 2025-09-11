package com.codecraft.master.repositories;

import com.codecraft.master.entities.OrganisationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface OrganisationCategoryRepository extends JpaRepository<OrganisationCategory, Integer>  , JpaSpecificationExecutor<OrganisationCategory> {
}

