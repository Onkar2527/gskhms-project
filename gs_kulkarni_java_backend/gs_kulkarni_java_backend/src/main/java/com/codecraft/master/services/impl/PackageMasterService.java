package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.PackageMaster;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.PackageMasterRepository;
import com.codecraft.master.specifications.PackageMasterSpecification;
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
public class PackageMasterService {
	
	@Autowired
	PackageMasterRepository packageMasterRepository;

	public MasterManagerResponse search(PackageMaster reqDomain) {
		log.info("PackageMasterService : search() started reqDomain {}", reqDomain);
		try {
			List<PackageMaster> packageMasters;
			Specification<PackageMaster> spec = Specification.where(PackageMasterSpecification.withHospitalId(UserContext.getHospitalId()));
			spec.and(PackageMasterSpecification.withIsActive(1));

			if(Objects.nonNull(reqDomain.getId()) && reqDomain.getId() != 0) {
				spec.and(PackageMasterSpecification.withId(reqDomain.getId()));
			}
			if(Objects.nonNull(reqDomain.getName())) {
				spec.and(PackageMasterSpecification.withName(reqDomain.getName()));
			}
			if(Objects.nonNull(reqDomain.getDeptId())) {
				spec.and(PackageMasterSpecification.withDeptId(reqDomain.getDeptId()));
			}
			
		    packageMasters = packageMasterRepository.findAll( spec);
			return new MasterManagerResponse(MasterConstant.SUCCESS, packageMasters);
		} catch (Exception e) {
			log.error("PackageMasterService : search() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(PackageMaster reqDomain) {
		log.info("PackageMasterService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.DATA_SAVED,packageMasterRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("PackageMasterService : save() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		log.info("PackageMasterService : deleteById() started reqDomain {}", id);
		try {
			packageMasterRepository.deleteById(id);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("PathologyTestsService : deleteById() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
