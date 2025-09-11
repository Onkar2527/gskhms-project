package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Floor;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.FloorRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class FloorService {

    @Autowired
    FloorRepository floorRepository;

    public MasterManagerResponse search(Floor reqDomain) {
        log.info("FloorService : search() started reqDomain {}", reqDomain);
        try {
            List<Floor> floorDetails = floorRepository.findByHospitalId(UserContext.getHospitalId());
            return new MasterManagerResponse(MasterConstant.SUCCESS, floorDetails);
        } catch (Exception e) {
            log.error("BedService : search() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(Floor reqDomain) {
        log.info("FloorService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getStatus())){
                reqDomain.setStatus("A");
            }
            reqDomain = floorRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
        } catch (Exception e) {
            log.error("BedService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(Floor reqDomain) {
        log.info("FloorService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getStatus())){
                reqDomain.setStatus("A");
            }
            reqDomain = floorRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
        } catch (Exception e) {
            log.error("FloorService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        log.info("FloorService : delete() started reqDomain {}", id);
        Optional<Floor> floorOptional = floorRepository.findById(id);
        if(floorOptional.isPresent()){
            floorRepository.delete(floorOptional.get());
            return new MasterManagerResponse(MasterConstant.SUCCESS);
        } else {
            return new MasterManagerResponse(MasterConstant.NOT_FOUND);
        }
    }
}
