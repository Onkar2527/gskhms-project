package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.TemplateDetails;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.TemplateDetailsRepository;
import com.codecraft.master.specifications.TemplateDetailsSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class TemplateDetailsService {
	
	@Autowired
	TemplateDetailsRepository templateDetailsRepository;

	public MasterManagerResponse search(TemplateDetails reqDomain) {
		log.info("TemplateService : search() started reqDomain {}", reqDomain);
		try {
			Specification<TemplateDetails> spec = Specification.where(TemplateDetailsSpecification.withIsActive(1));

			List<TemplateDetails> templateDetails = templateDetailsRepository.findAll(spec);
			return new MasterManagerResponse(MasterConstant.SUCCESS, templateDetails);
		} catch (Exception e) {
			log.error("TemplateService : search() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(TemplateDetails reqDomain) {
		log.info("TemplateService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain = templateDetailsRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("TemplateService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse delete(Integer id) {
		Optional<TemplateDetails> templateDetailsOptional = templateDetailsRepository.findById(id);
		if(templateDetailsOptional.isPresent()){
			TemplateDetails templateDetails = templateDetailsOptional.get();
			templateDetails.setActiveInd(0);
			templateDetailsRepository.save(templateDetails);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, templateDetails );
		}else{
			throw new MasterManagerException(MasterConstant.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}
}
