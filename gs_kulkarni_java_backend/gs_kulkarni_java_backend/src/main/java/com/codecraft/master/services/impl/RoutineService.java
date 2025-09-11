package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Routine;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.RoutineRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RoutineService {
	
	@Autowired
	RoutineRepository routineRepository;

	public MasterManagerResponse search(Routine reqDomain) {
		log.info("RoutineService : search() started reqDomain {}", reqDomain);
		try {
			List<Routine> consumeDetails = routineRepository.findAll();
			return new MasterManagerResponse(MasterConstant.SUCCESS, consumeDetails);
		} catch (Exception e) {
			log.error("RoutineService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Routine reqDomain) {
		log.info("RoutineService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);

			return new MasterManagerResponse(MasterConstant.DATA_SAVED,routineRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("RoutineService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
