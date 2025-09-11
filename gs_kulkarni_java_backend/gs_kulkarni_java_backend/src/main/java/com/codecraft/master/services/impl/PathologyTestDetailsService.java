package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.PathologyTestDetails;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.PathologyTestAgeRangeRepository;
import com.codecraft.master.repositories.PathologyTestDetailsRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class PathologyTestDetailsService {
	
	@Autowired
	PathologyTestDetailsRepository pathologyTestDetailsRepository;

	public MasterManagerResponse search(PathologyTestDetails reqDomain) {
		log.info("PathologyTestDetailsService : search() started reqDomain {}", reqDomain);
		try {
			List<PathologyTestDetails> pathologyTestsDetails;
			if (Objects.nonNull(reqDomain.getId()) && reqDomain.getId() != 0) {
				pathologyTestsDetails = pathologyTestDetailsRepository.findAllById(List.of(reqDomain.getId()));
			} else if (Objects.nonNull(reqDomain.getPathologyTestId()) && reqDomain.getPathologyTestId() != 0) {
				pathologyTestsDetails = pathologyTestDetailsRepository.findByPathologyTestId(reqDomain.getPathologyTestId());
			} else {
				pathologyTestsDetails = pathologyTestDetailsRepository.findAll();
			}
			return new MasterManagerResponse(MasterConstant.SUCCESS, pathologyTestsDetails);
		} catch (Exception e) {
			log.error("PathologyTestDetailsService : search() Exception occured while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@Transactional
	public MasterManagerResponse save(PathologyTestDetails reqDomain) {
		log.info("PathologyTestDetailsService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED,pathologyTestDetailsRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("PathologyTestDetailsService : save() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		log.info("PathologyTestDetailsService : deleteById() started reqDomain {}", id);
		try {
			pathologyTestDetailsRepository.deleteById(id);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("PathologyTestDetailsService : deleteById() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
