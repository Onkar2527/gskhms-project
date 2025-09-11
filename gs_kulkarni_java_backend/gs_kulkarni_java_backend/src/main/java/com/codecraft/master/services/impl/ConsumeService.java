package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Consume;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.ConsumeRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ConsumeService {
	
	@Autowired
	ConsumeRepository consumeRepository;

	public MasterManagerResponse search(Consume reqDomain) {
		log.info("ConsumeService : search() started reqDomain {}", reqDomain);
		try {
			List<Consume> consumeDetails = consumeRepository.findAll();
			return new MasterManagerResponse(MasterConstant.SUCCESS, consumeDetails);
		} catch (Exception e) {
			log.error("ConsumeService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Consume reqDomain) {
		log.info("BankService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, consumeRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("ConsumeService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
