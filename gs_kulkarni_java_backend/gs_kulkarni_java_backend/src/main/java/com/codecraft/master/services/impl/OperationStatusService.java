package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.OperationStatus;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.AppointmentRepository;
import com.codecraft.master.repositories.OperationStatusRepository;
import com.codecraft.master.specifications.OperationStatusSpecification;
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
public class OperationStatusService {

	@Autowired
	OperationStatusRepository operationStatusRepository;

	@Autowired
	AppointmentRepository appointmentRepository;

	public MasterManagerResponse search(OperationStatus reqDomain) {
		log.info("OTRegistrationService : search() started reqDomain {}", reqDomain);
		try {
			Specification<OperationStatus> spec = Specification.where(OperationStatusSpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(OperationStatusSpecification.withIsActive(1)));

			if(Objects.nonNull(reqDomain.getId())){
				spec = spec.and(Specification.where(OperationStatusSpecification.withId(reqDomain.getId())));
			}

			if(Objects.nonNull(reqDomain.getOperationId())){
				spec = spec.and(Specification.where(OperationStatusSpecification.withOtRegistrationId(reqDomain.getOperationId())));
			}

			if(Objects.nonNull(reqDomain.getAppointmentId())){
				spec = spec.and(Specification.where(OperationStatusSpecification.withAppointmentId(reqDomain.getAppointmentId())));
			}

			if(Objects.nonNull(reqDomain.getStartDateTime()) && Objects.nonNull(reqDomain.getEndDateTime()) ){
				spec = spec.and(Specification.where(OperationStatusSpecification.withOperationDateBetween(reqDomain.getStartDateTime(), reqDomain.getEndDateTime())));
			}

			List<OperationStatus> otRegistrationList = operationStatusRepository.findAll(spec);

			return new MasterManagerResponse(MasterConstant.SUCCESS, otRegistrationList);
		} catch (Exception e) {
			log.error("OTRegistrationService : search() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@Transactional
    public MasterManagerResponse update(OperationStatus reqDomainDTO) {
		log.info("OTRegistrationService : update() started reqDomain {}", reqDomainDTO);
		try {
			Optional<OperationStatus> reqDomainOptional = operationStatusRepository.findByOperationId(reqDomainDTO.getOperationId());

			if(reqDomainOptional.isPresent()) {
				OperationStatus os = reqDomainOptional.get();
				os.setActiveInd(1);

				if(Objects.nonNull(reqDomainDTO.getOperationStatus())){
					os.setOperationStatus(reqDomainDTO.getOperationStatus());
				}
				if(Objects.nonNull(reqDomainDTO.getPreCleaningStatus())){
					os.setPreCleaningStatus(reqDomainDTO.getPreCleaningStatus());
				}
				if(Objects.nonNull(reqDomainDTO.getPostCleaningStatus())){
					os.setPostCleaningStatus(reqDomainDTO.getPostCleaningStatus());
				}
				if(Objects.nonNull(reqDomainDTO.getPrecautionaryNote())){
					os.setPrecautionaryNote(reqDomainDTO.getPrecautionaryNote());
				}
				if(Objects.nonNull(reqDomainDTO.getOperationNote())){
					os.setOperationNote(reqDomainDTO.getOperationNote());
				}
				if(Objects.nonNull(reqDomainDTO.getFolloupDate())){
					os.setFolloupDate(reqDomainDTO.getFolloupDate());
				}
				if(Objects.nonNull(reqDomainDTO.getEndDateTime())){
					os.setEndDateTime(reqDomainDTO.getEndDateTime());
				}
				if(Objects.nonNull(reqDomainDTO.getStartDateTime())){
					os.setStartDateTime(reqDomainDTO.getStartDateTime());
				}
				os = operationStatusRepository.save(os);
				return new MasterManagerResponse(MasterConstant.DATA_SAVED, os);
			}else{
				return new MasterManagerResponse(MasterConstant.DATA_SAVED, null);
			}

		} catch (Exception e) {
			log.error("OTRegistrationService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

}