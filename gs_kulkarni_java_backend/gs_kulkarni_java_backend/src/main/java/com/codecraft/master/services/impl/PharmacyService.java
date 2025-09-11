package com.codecraft.master.services.impl;


import com.codecraft.master.configs.UserContext;
import com.codecraft.master.entities.Pharmacy;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.PharmacyRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PharmacyService {
	

	@Autowired
	PharmacyRepository pharmacyRepository;

	public MasterManagerResponse search() {
			log.info("PharmacyService : search() started");
			return new MasterManagerResponse("Success", pharmacyRepository.findAll());
	}

	@Transactional
	public MasterManagerResponse save(Pharmacy reqDomain) {
		reqDomain.setActiveInd(1);
		return new MasterManagerResponse("Success", pharmacyRepository.save(reqDomain));
	}
}
