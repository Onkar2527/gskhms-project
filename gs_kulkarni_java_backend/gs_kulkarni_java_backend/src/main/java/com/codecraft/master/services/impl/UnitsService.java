package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Units;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.UnitsRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UnitsService {

    @Autowired
    UnitsRepository unitsRepository;

    public MasterManagerResponse search(Units reqDomain) {
        log.info("UnitsService : search() started reqDomain {}", reqDomain);
        try {
            List<Units> consumeDetails = unitsRepository.findAll();
            return new MasterManagerResponse(MasterConstant.SUCCESS, consumeDetails);
        } catch (Exception e) {
            log.error("UnitsService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(Units reqDomain) {
        log.info("UnitsService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);

            return new MasterManagerResponse(MasterConstant.DATA_SAVED, unitsRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("UnitsService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
