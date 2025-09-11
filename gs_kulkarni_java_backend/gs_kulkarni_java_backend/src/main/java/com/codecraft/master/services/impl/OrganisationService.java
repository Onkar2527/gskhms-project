package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Organisation;
import com.codecraft.master.entities.OrganisationCategory;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.OrganisationMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.OrganisationDTO;
import com.codecraft.master.repositories.OrganisationCategoryRepository;
import com.codecraft.master.repositories.OrganisationRepository;
import com.codecraft.master.specifications.OrganisationSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class OrganisationService {

    @Autowired
    OrganisationRepository organisationRepository;
    @Autowired
    OrganisationCategoryRepository organisationCategoryRepository;


    @Autowired
    OrganisationMapper organisationMapper;

    public MasterManagerResponse search(Organisation reqDomain) {
        log.info("OrganisationService : search() started reqDomain {}", reqDomain);
        try {
            Specification<Organisation> spec = Specification.where(OrganisationSpecification.withIsActive(1));
            if(Objects.nonNull(reqDomain.getHospitalId())) {
                spec = spec.and(Specification.where(OrganisationSpecification.withHospitalId(reqDomain.getHospitalId())));
            }
            if(Objects.nonNull(reqDomain.getCategoryId())) {
                spec = spec.and(Specification.where(OrganisationSpecification.withCategoryId(reqDomain.getCategoryId())));
            }

            List<Organisation> organisations = organisationRepository.findAll(spec);

            List<OrganisationDTO> organisationDTOList = new ArrayList<>();

            organisations.forEach(organisation -> {
                OrganisationDTO organisationDTO = organisationMapper.organisationToOrganisationDTO(organisation);
                Optional<OrganisationCategory> organisationCategoryOptional = organisationCategoryRepository.findById(organisationDTO.getCategoryId());
                organisationCategoryOptional.ifPresent(organisationCategory -> organisationDTO.setCategoryName(organisationCategory.getName()));
                organisationDTOList.add(organisationDTO);
            });
            return new MasterManagerResponse(MasterConstant.SUCCESS, organisationDTOList);

        } catch (Exception e) {
            log.error("OrganisationService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(Organisation reqDomain) {
        log.info("OrganisationService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, organisationRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("OrganisationService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(Organisation reqDomain) {
        log.info("OrganisationService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, organisationRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("OrganisationService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
