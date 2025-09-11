package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Services;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.ServicesRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class ServicesService{
	
	@Autowired
	ServicesRepository servicesRepository;

	public MasterManagerResponse search(Services reqDomain) {
		log.info("ServicesService : search() started reqDomain {}", reqDomain);
		try {
			List<Services> details = servicesRepository.findByHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.SUCCESS, details);
		} catch (Exception e) {
			log.error("ServicesService : search() Exception occured while fetching services details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Services reqDomain) {
		log.info("ServicesService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);

			if(Objects.isNull(reqDomain.getOtherService())){
				reqDomain.setOtherService("N");
			}
			reqDomain.setHospitalId(UserContext.getHospitalId());

			return new MasterManagerResponse(MasterConstant.DATA_SAVED,servicesRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("ServicesService : save() Exception occurred while save services", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse update(Services reqDomain) {
		log.info("ServicesService : update() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());

			if(Objects.isNull(reqDomain.getOtherService())){
				reqDomain.setOtherService("N");
			}
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY,servicesRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("ServicesService : update() Exception occurred while updating services", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	public MasterManagerResponse getAll() {
		try {
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY,servicesRepository.getAll(UserContext.getHospitalId()));
		} catch (Exception e) {
			log.error("ServicesService : getAll() Exception occurred while updating services", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse getAllByType(String type) {
		try {
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY,servicesRepository.getAllByType(UserContext.getHospitalId(), type));
		} catch (Exception e) {
			log.error("ServicesService : getAllByType() Exception occurred while updating services", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
