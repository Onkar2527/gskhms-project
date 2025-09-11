package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Template;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.TemplateRepository;
import com.codecraft.master.specifications.TemplateSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class TemplateService {
	
	@Autowired
	TemplateRepository templateRepository;

	public MasterManagerResponse search(Template reqDomain) {
		log.info("TemplateService : search() started reqDomain {}", reqDomain);
		try {
			Specification<Template> spec = Specification.where(TemplateSpecification.withIsActive(1));

			List<Template> templateDetails = templateRepository.findAll(spec);
			return new MasterManagerResponse(MasterConstant.SUCCESS, templateDetails);
		} catch (Exception e) {
			log.error("TemplateService : search() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Template reqDomain) {
		log.info("TemplateService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain = templateRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("TemplateService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
