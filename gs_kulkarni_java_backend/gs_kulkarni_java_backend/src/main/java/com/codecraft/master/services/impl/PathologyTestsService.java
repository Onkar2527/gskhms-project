package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.PathologyTests;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.PathologyTestsRepository;
import com.codecraft.master.specifications.PathologyTestsSpecification;
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
public class PathologyTestsService {
	
	@Autowired
	PathologyTestsRepository pathologyTestsRepository;

	public MasterManagerResponse search(PathologyTests reqDomain) {
		log.info("PathologyTestsService : search() started reqDomain {}", reqDomain);
		try {

			List<PathologyTests> pathologyTests;
			Specification<PathologyTests> spec = Specification.where(PathologyTestsSpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(PathologyTestsSpecification.withIsActive(1)));

			if(Objects.nonNull(reqDomain.getId()) && reqDomain.getId() != 0) {
				spec = spec.and(Specification.where(PathologyTestsSpecification.withId(reqDomain.getId())));
			}
			if(Objects.nonNull(reqDomain.getType())) {
				spec = spec.and(Specification.where(PathologyTestsSpecification.withType(reqDomain.getType())));
			}
		    pathologyTests = pathologyTestsRepository.findAll( spec);
			return new MasterManagerResponse(MasterConstant.SUCCESS, pathologyTests);
		} catch (Exception e) {
			log.error("PathologyTestsService : search() Exception occured while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(PathologyTests reqDomain) {
		log.info("PathologyTestsService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.DATA_SAVED,pathologyTestsRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("PathologyTestsService : save() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@Transactional
	public MasterManagerResponse update(PathologyTests reqDomain) {
		log.info("PathologyTestsService : update() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.DATA_SAVED,pathologyTestsRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("PathologyTestsService : update() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		log.info("PathologyTestsService : deleteById() started reqDomain {}", id);
		try {

			pathologyTestsRepository.deleteById(id);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("PathologyTestsService : deleteById() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
