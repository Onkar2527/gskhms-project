package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Hospital;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.HospitalRepository;
import com.codecraft.master.specifications.HospitalSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
@Slf4j
public class HospitalService {

	@Autowired
	HospitalRepository hospitalRepository;

	public MasterManagerResponse search(Hospital reqDomain) {
		log.info("HospitalService : search() started reqDomain {}", reqDomain);
		try {
			List<Hospital> hospitalList;
			if(Objects.isNull(reqDomain.getId()) || reqDomain.getId() == 0) {
				hospitalList = hospitalRepository.findAll();
			}else{
				Specification<Hospital> spec = Specification.where(HospitalSpecification.withHospitalId(reqDomain.getId()));
				spec = spec.and(Specification.where(HospitalSpecification.withActiveInd(1)));

				hospitalList = hospitalRepository.findAll(spec);
			}
			return new MasterManagerResponse(MasterConstant.SUCCESS, hospitalList);
		} catch (Exception e) {
			log.error("HospitalService : search() Exception occured while fetching hospital details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(Hospital reqDomain) {
		log.info("HospitalService : save() started reqDomain {}", reqDomain);
		try {
			if(Objects.isNull(reqDomain.getLabServices())){
				reqDomain.setLabServices("N");
			}
			if(Objects.isNull(reqDomain.getXrayServices())){
				reqDomain.setXrayServices("N");
			}
			if(Objects.isNull(reqDomain.getIpdServices())){
				reqDomain.setXrayServices("N");
			}
			if(Objects.isNull(reqDomain.getSonoServices())){
				reqDomain.setSonoServices("N");
			}
			if(Objects.isNull(reqDomain.getIpdServices())){
				reqDomain.setSonoServices("N");
			}
			if(Objects.isNull(reqDomain.getInsuranceAvailable())){
				reqDomain.setInsuranceAvailable("N");
			}
			if(Objects.isNull(reqDomain.getDiscountApplicable())){
				reqDomain.setDiscountApplicable("N");
			}
			reqDomain.setActiveInd(1);
			Hospital hospital = hospitalRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, hospital);
		} catch (Exception e) {
			log.error("HospitalService : save() Exception occured while save hospital", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse update(Hospital reqDomain) {
		log.info("HospitalService : update() started reqDomain {}", reqDomain);
		try {

			if(Objects.nonNull(reqDomain.getId())){
				Optional<Hospital> hospitalOptional = hospitalRepository.findById(reqDomain.getId());
				if(hospitalOptional.isPresent()){
					Hospital hospital = hospitalOptional.get();

					if(Objects.isNull(reqDomain.getHospitalCode())){
						reqDomain.setHospitalCode(hospital.getHospitalCode());
					}

				}
				reqDomain.setActiveInd(1);
				reqDomain = hospitalRepository.save(reqDomain);
			}
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("HospitalService : update() Exception occured while updating hospital", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
