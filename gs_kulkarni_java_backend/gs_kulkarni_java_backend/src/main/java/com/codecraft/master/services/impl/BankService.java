package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Bank;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.BankRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class BankService {
	
	@Autowired
	BankRepository bankRepository;

	public MasterManagerResponse search(Bank reqDomain) {
		log.info("BankService : search() started reqDomain {}", reqDomain);
		try {
			List<Bank> bankDetails = bankRepository.findByHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.SUCCESS, bankDetails);

		} catch (Exception e) {
			log.error("BankService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Bank reqDomain) {
		log.info("BankService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.DATA_SAVED,bankRepository.save(reqDomain));

		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : save() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse update(Bank reqDomain) {
		log.info("BankService : update() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY,bankRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : update() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse delete(Integer bankId) {
		log.info("BankService : delete() started bankId {}", bankId);
		try {
			bankRepository.deleteByBankId(bankId);
			return new MasterManagerResponse(MasterConstant.DATA_DELETE);
		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : delete() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
