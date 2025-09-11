package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.GTemplate;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.GTemplateRepository;
import com.codecraft.master.specifications.GTemplateSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class GTemplateService {
	
	@Autowired
	GTemplateRepository templateRepository;

	public MasterManagerResponse search(GTemplate reqDomain) {
		log.info("GTemplateService : search() started reqDomain {}", reqDomain);
		try {
			Specification<GTemplate> spec = Specification.where(GTemplateSpecification.withIsActive(1));

			List<GTemplate> templateDetails = templateRepository.findAll(spec);
			return new MasterManagerResponse(MasterConstant.SUCCESS, templateDetails);
		} catch (Exception e) {
			log.error("GTemplateService : search() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(GTemplate reqDomain) {
		log.info("GTemplateService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain = templateRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("GTemplateService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse findById(GTemplate reqDomain) {
	log.info("GTemplateService : findById() started reqDomain {}", reqDomain);
	try {
		Integer operation_id = reqDomain.getId(); 

		GTemplate template = templateRepository.findById(operation_id)
			.orElseThrow(() -> new MasterManagerException(MasterConstant.SUCCESS, HttpStatus.NOT_FOUND));

		return new MasterManagerResponse(MasterConstant.SUCCESS, template);
	} catch (Exception e) {
		log.error("GTemplateService : findById() Exception occurred while fetching user details", e);
		throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

}
