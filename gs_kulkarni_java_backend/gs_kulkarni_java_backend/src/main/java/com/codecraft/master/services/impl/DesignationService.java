package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Designation;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.DesignationRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DesignationService{
	
	@Autowired
	DesignationRepository designationRepository;

	public MasterManagerResponse search(Designation reqDomain) {
		log.info("DesignationService : search() started reqDomain {}", reqDomain);
		try {
			List<Designation> designationDetails = designationRepository.findByHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.SUCCESS, designationDetails);
		} catch (Exception e) {
			log.error("DesignationService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Designation reqDomain) {
		log.info("DesignationService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
		    return new MasterManagerResponse(MasterConstant.DATA_SAVED,designationRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("DesignationService : save() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse update(Designation reqDomain) {
		log.info("DesignationService : update() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY,designationRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("DesignationService : update() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse delete(Integer id) {
		log.info("DesignationService : delete() started id {}", id);
		try {
			designationRepository.deleteById(id);
			return new MasterManagerResponse(MasterConstant.DATA_DELETE);
		} catch (Exception e) {
			log.error("DesignationService : delete() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
