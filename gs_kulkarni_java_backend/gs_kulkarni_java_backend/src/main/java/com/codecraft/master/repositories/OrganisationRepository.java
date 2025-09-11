package com.codecraft.master.repositories;

import com.codecraft.master.entities.BillingHeader;
import com.codecraft.master.entities.Organisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface OrganisationRepository extends JpaRepository<Organisation, Integer> , JpaSpecificationExecutor<Organisation> {
}

