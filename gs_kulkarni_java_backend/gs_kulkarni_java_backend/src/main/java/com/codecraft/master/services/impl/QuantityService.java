package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Quantity;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.QuantityRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class QuantityService {
	
	@Autowired
	QuantityRepository quantityRepository;

	public MasterManagerResponse search(Quantity reqDomain) {
		log.info("QuantityService : search() started reqDomain {}", reqDomain);
		try {
			List<Quantity> consumeDetails = quantityRepository.findAll();
			return new MasterManagerResponse(MasterConstant.SUCCESS, consumeDetails);
		} catch (Exception e) {
			log.error("QuantityService : search() Exception occured while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Quantity reqDomain) {
		log.info("QuantityService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);

			quantityRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("QuantityService : save() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
