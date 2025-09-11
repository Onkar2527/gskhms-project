package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.BillingClass;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.BillingClassRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class BillingClassService {

    @Autowired
    BillingClassRepository billingClassRepository;

    public MasterManagerResponse search(BillingClass reqDomain) {
        log.info("BillingClassService : search() started reqDomain {}", reqDomain);
        try {
            List<BillingClass> billingClassDetails = billingClassRepository.findByHospitalId(UserContext.getHospitalId());
            return new MasterManagerResponse(MasterConstant.SUCCESS, billingClassDetails);
        } catch (Exception e) {
            log.error("BedService : search() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(BillingClass reqDomain) {
        log.info("BillingClassService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = billingClassRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
        } catch (Exception e) {
            log.error("BillingClassService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(BillingClass reqDomain) {
        log.info("BillingClassService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = billingClassRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
        } catch (Exception e) {
            log.error("BillingClassService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        log.info("BillingClassService : delete() started reqDomain {}", id);
        Optional<BillingClass> billingClassOptional = billingClassRepository.findById(id);
        if(billingClassOptional.isPresent()){
            billingClassRepository.delete(billingClassOptional.get());
            return new MasterManagerResponse(MasterConstant.SUCCESS);
        } else {
            return new MasterManagerResponse(MasterConstant.NOT_FOUND);
        }
    }
}
