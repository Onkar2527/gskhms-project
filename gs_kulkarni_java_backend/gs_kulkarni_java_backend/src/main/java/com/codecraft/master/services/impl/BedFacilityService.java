package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.BedFacility;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.BedFacilityRepository;
import com.codecraft.master.specifications.BedFaciliySpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class BedFacilityService {

	@Autowired
	BedFacilityRepository bedFacilityRepository;

	public MasterManagerResponse search(BedFacility reqDomain) {
		log.info("BedFacilityService : search() started reqDomain {}", reqDomain);
		try {


			Specification<BedFacility> spec = Specification.where(BedFaciliySpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(BedFaciliySpecification.withIsActive(1)));

			if(Objects.nonNull(reqDomain.getAppointmentId())){
				spec = spec.and(Specification.where(BedFaciliySpecification.withAppointmentId(reqDomain.getAppointmentId())));
			}
			List<BedFacility> bedDetails = bedFacilityRepository.findAll(spec);

			return new MasterManagerResponse(MasterConstant.SUCCESS, bedDetails);
		} catch (Exception e) {
			log.error("BedFacilityService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(BedFacility reqDomain) {
		log.info("BedFacilityService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = bedFacilityRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("BedFacilityService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
    public MasterManagerResponse update(BedFacility reqDomain) {
		log.info("BedFacilityService : update() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = bedFacilityRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("BedFacilityService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		log.info("BedFacilityService : delete() started reqDomain {}", id);
		Optional<BedFacility> bedFacilityOptional = bedFacilityRepository.findById(id);
		if(bedFacilityOptional.isPresent()){
			bedFacilityRepository.delete(bedFacilityOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}

	@Transactional
	public MasterManagerResponse deleteByAppointmentId(Integer appointmentId) {
		log.info("BedFacilityService : delete() started reqDomain {}", appointmentId);
		List<BedFacility> bedFacilityList = bedFacilityRepository.findByAppointmentId(appointmentId);
		if(!CollectionUtils.isEmpty(bedFacilityList)){
			bedFacilityRepository.deleteAll(bedFacilityList);
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}
}
