package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.OTMaster;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.OTMasterRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class OperationTMasterService {

    @Autowired
    OTMasterRepository otMasterRepository;

    public MasterManagerResponse search(OTMaster reqDomain) {
        log.info("OperationTypeService : search() started reqDomain {}", reqDomain);
        try {
            List<OTMaster> operationTypes = otMasterRepository.findByHospitalId(UserContext.getHospitalId());
            return new MasterManagerResponse(MasterConstant.SUCCESS, operationTypes);

        } catch (Exception e) {
            log.error("OrganisationService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(OTMaster reqDomain) {
        log.info("OperationTypeService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, otMasterRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("OrganisationService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(OTMaster reqDomain) {
        log.info("OperationTypeService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, otMasterRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("OrganisationService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
