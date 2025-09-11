package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.OrganisationCategory;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.OrganisationCategoryRepository;
import com.codecraft.master.specifications.OrganisationCategorySpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class OrganisationCategoryService {


    @Autowired
    OrganisationCategoryRepository organisationCategoryRepository;

    public MasterManagerResponse search(OrganisationCategory reqDomain) {
        log.info("OrganisationService : search() started reqDomain {}", reqDomain);
        try {
            Specification<OrganisationCategory> spec = Specification.where(OrganisationCategorySpecification.withIsActive(1));
            if(Objects.nonNull(reqDomain.getHospitalId())) {
                spec = spec.and(Specification.where(OrganisationCategorySpecification.withHospitalId(reqDomain.getHospitalId())));
            }
            List<OrganisationCategory> organisations = organisationCategoryRepository.findAll(spec);

            return new MasterManagerResponse(MasterConstant.SUCCESS, organisations);
        } catch (Exception e) {
            log.error("OrganisationService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(OrganisationCategory reqDomain) {
        log.info("OrganisationService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, organisationCategoryRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("OrganisationService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(OrganisationCategory reqDomain) {
        log.info("OrganisationService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, organisationCategoryRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("OrganisationService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

