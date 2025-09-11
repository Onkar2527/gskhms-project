package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.PackageMasterDetails;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.PackageMasterDetailsRepository;
import com.codecraft.master.specifications.PackageMasterDetailsSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class PackageMasterDetailsService {
	
	@Autowired
	PackageMasterDetailsRepository packageMasterDetailsRepository;

	public MasterManagerResponse search(PackageMasterDetails reqDomain) {
		log.info("PackageMasterDetailsService : search() started reqDomain {}", reqDomain);
		try {
			List<PackageMasterDetails> packageMasterDetailsList;

			Specification<PackageMasterDetails> spec = Specification.where(PackageMasterDetailsSpecification.withIsActive(1));

			if(Objects.nonNull(reqDomain.getId()) && reqDomain.getId() != 0){
					spec = spec.and(PackageMasterDetailsSpecification.withId(reqDomain.getId()));
			}

			if(Objects.nonNull(reqDomain.getPackageId()) && reqDomain.getPackageId() != 0){
					spec = spec.and(Specification.where(PackageMasterDetailsSpecification.withPackageId(reqDomain.getPackageId())));
			}

			if(Objects.nonNull(reqDomain.getServiceId()) && reqDomain.getServiceId() != 0){
					spec = spec.and(Specification.where(PackageMasterDetailsSpecification.withServiceId(reqDomain.getServiceId())));
			}

			packageMasterDetailsList = packageMasterDetailsRepository.findAll(spec);
			return new MasterManagerResponse(MasterConstant.SUCCESS, packageMasterDetailsList);
		} catch (Exception e) {
			log.error("PackageMasterDetailsService : search() Exception occured while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(PackageMasterDetails reqDomain) {
		log.info("PackageMasterDetailsService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED,packageMasterDetailsRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("PackageMasterDetailsService : save() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		log.info("PackageMasterDetailsService : deleteById() started reqDomain {}", id);
		try {
			packageMasterDetailsRepository.deleteById(id);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("PackageMasterDetailsService : deleteById() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
