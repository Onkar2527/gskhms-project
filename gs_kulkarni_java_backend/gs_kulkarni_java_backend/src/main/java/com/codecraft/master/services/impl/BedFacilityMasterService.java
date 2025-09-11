package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.BedFacilityMaster;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.BedFacilityMasterRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class BedFacilityMasterService {

	@Autowired
	BedFacilityMasterRepository bedFacilityRepository;

	public MasterManagerResponse search(BedFacilityMaster reqDomain) {
		log.info("BedFacilityService : search() started reqDomain {}", reqDomain);
		try {
			List<BedFacilityMaster> bedDetails = bedFacilityRepository.findByHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.SUCCESS, bedDetails);
		} catch (Exception e) {
			log.error("BedFacilityService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(BedFacilityMaster reqDomain) {
		log.info("BedFacilityService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = bedFacilityRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("BedFacilityService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
    public MasterManagerResponse update(BedFacilityMaster reqDomain) {
		log.info("BedFacilityService : update() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = bedFacilityRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("BedFacilityService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		log.info("BedFacilityService : delete() started reqDomain {}", id);
		Optional<BedFacilityMaster> bedFacilityOptional = bedFacilityRepository.findById(id);
		if(bedFacilityOptional.isPresent()){
			bedFacilityRepository.delete(bedFacilityOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}

}
