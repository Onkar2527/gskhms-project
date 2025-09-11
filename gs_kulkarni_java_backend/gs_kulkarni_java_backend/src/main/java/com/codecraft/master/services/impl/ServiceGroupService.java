package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.ServiceGroup;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.ServicesGroupRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ServiceGroupService {
	

	@Autowired
	ServicesGroupRepository serviceGroupRepository;

	public MasterManagerResponse search(ServiceGroup serviceGroupDomain) {
		log.info("ServiceGroupServiceImpl : search() started serviceGroupDomain {}", serviceGroupDomain);
		try {
			List<ServiceGroup> serviceGroupDetails = serviceGroupRepository.findByHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.SUCCESS, serviceGroupDetails);
		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(ServiceGroup serviceGroupDomain) {
		log.info("ServiceGroupServiceImpl : save() started serviceGroupDomain {}", serviceGroupDomain);
		try {
			serviceGroupDomain.setActiveInd(1);
			serviceGroupDomain.setHospitalId(UserContext.getHospitalId());

			return  new MasterManagerResponse(MasterConstant.DATA_SAVED,serviceGroupRepository.save(serviceGroupDomain));
		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : save() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse update(ServiceGroup serviceGroupDomain) {
		log.info("ServiceGroupServiceImpl : update() started serviceGroupDomain {}", serviceGroupDomain);
		try {
			serviceGroupDomain.setActiveInd(1);
			serviceGroupDomain.setHospitalId(UserContext.getHospitalId());

			return new MasterManagerResponse(MasterConstant.DATA_MODIFY, serviceGroupRepository.save(serviceGroupDomain));
		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : update() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse delete(Integer groupId) {
		log.info("ServiceGroupServiceImpl : delete() started groupId {}", groupId);
		try {
			serviceGroupRepository.deleteByGroupId(groupId);
			return new MasterManagerResponse(MasterConstant.DATA_DELETE);
		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : delete() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
