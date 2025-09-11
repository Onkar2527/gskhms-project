package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Doses;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.DosesRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DosesService {
	
	@Autowired
	DosesRepository dosesRepository;

	public MasterManagerResponse search(Doses reqDomain) {
		log.info("DosesService : search() started reqDomain {}", reqDomain);
		try {
			List<Doses> consumeDetails = dosesRepository.findAll();
			return new MasterManagerResponse(MasterConstant.SUCCESS, consumeDetails);
		} catch (Exception e) {
			log.error("DosesService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Doses reqDomain) {
		log.info("DosesService : save() started reqDomain {}", reqDomain);
		try {
			dosesRepository.save(reqDomain);
		return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("DosesService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
