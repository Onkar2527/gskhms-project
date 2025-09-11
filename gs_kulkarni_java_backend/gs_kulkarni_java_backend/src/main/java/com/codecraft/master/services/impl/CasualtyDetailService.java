package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.CasualityDetail;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.CasulalityDetailRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CasualtyDetailService {
	
	@Autowired
	CasulalityDetailRepository casulalityDetailRepository;

	public MasterManagerResponse search(CasualityDetail reqDomain) {
		log.info("CasualtyDetailService : search() started reqDomain {}", reqDomain);
		try {
			return new MasterManagerResponse(MasterConstant.SUCCESS, casulalityDetailRepository.findAll());
		} catch (Exception e) {
			log.error("CasualityDetailService : search() Exception occured while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(CasualityDetail reqDomain) {
		log.info("CasualtyDetailService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED,casulalityDetailRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("CasualtyDetailService : save() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		log.info("CasualtyDetailService : deleteById() started reqDomain {}", id);
		try {
			casulalityDetailRepository.deleteById(id);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("CasualtyDetailService : deleteById() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
