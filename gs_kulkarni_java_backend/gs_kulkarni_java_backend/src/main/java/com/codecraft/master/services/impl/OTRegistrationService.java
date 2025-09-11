package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.OTRegistrationMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.OTRegistrationDTO;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.OTRegistrationSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class OTRegistrationService {

	@Autowired
	OTRegistrationRepository otRegistrationRepository;

	@Autowired
	OTRegistrationMapper otRegistrationMapper;

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	AppointmentRepository appointmentRepository;

	@Autowired
	OperationStatusRepository operationStatusRepository;

	public MasterManagerResponse search(OTRegistrationDTO reqDomain) {
		log.info("OTRegistrationService : search() started reqDomain {}", reqDomain);
		try {
			Specification<OTRegistration> spec = Specification.where(OTRegistrationSpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(OTRegistrationSpecification.withIsActive(1)));

			if(Objects.nonNull(reqDomain.getId())){
				spec = spec.and(Specification.where(OTRegistrationSpecification.withId(reqDomain.getId())));
			}
			if(Objects.nonNull(reqDomain.getAppointmentId())){
				spec = spec.and(Specification.where(OTRegistrationSpecification.withAppointmentId(reqDomain.getAppointmentId())));
			}

			if(Objects.nonNull(reqDomain.getPatientId())){
				spec = spec.and(Specification.where(OTRegistrationSpecification.withPatientId(reqDomain.getPatientId())));
			}

			if(Objects.nonNull(reqDomain.getInDate()) && Objects.nonNull(reqDomain.getOutDate()) ){
				spec = spec.and(Specification.where(OTRegistrationSpecification.withOperationDateBetween(reqDomain.getInDate(), reqDomain.getOutDate())));
			}

			List<OTRegistration> otRegistrationList = otRegistrationRepository.findAll(spec);
			List<OTRegistrationDTO> otRegistrationDTOList = new ArrayList<>();
			otRegistrationList.forEach(otRegistration -> {
				otRegistrationDTOList.add(getOTRegistrationDTO(otRegistration));
			});

			return new MasterManagerResponse(MasterConstant.SUCCESS, otRegistrationDTOList);
		} catch (Exception e) {
			log.error("OTRegistrationService : search() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(OTRegistrationDTO reqDomainDTO) {
		log.info("OTRegistrationService : save() started reqDomain {}", reqDomainDTO);
		try {
			OTRegistration reqDomain = otRegistrationMapper.otRegistrationDTOToOTRegistration(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = otRegistrationRepository.save(reqDomain);

			OperationStatus operationStatus = new OperationStatus();
			operationStatus.setActiveInd(1);
			operationStatus.setHospitalId(UserContext.getHospitalId());
			operationStatus.setAppointmentId(reqDomain.getAppointmentId());
			operationStatus.setOperationId(reqDomain.getId());
			operationStatus.setStartDateTime(reqDomain.getInDate());
			operationStatus.setEndDateTime(reqDomain.getOutDate());
			operationStatus.setOperationStatus("PENDING");
			operationStatusRepository.save(operationStatus);

			return new MasterManagerResponse(MasterConstant.DATA_SAVED, getOTRegistrationDTO(reqDomain));
		} catch (Exception e) {
			log.error("OTRegistrationService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
    public MasterManagerResponse update(OTRegistrationDTO reqDomainDTO) {
		log.info("OTRegistrationService : update() started reqDomain {}", reqDomainDTO);
		try {
			OTRegistration reqDomain = otRegistrationMapper.otRegistrationDTOToOTRegistration(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = otRegistrationRepository.save(reqDomain);

			return new MasterManagerResponse(MasterConstant.DATA_SAVED, getOTRegistrationDTO(reqDomain));
		} catch (Exception e) {
			log.error("OTRegistrationService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

	@Transactional
	public MasterManagerResponse delete(Integer id) {
		log.info("OTRegistrationService : delete() started reqDomain {}", id);
		Optional<OTRegistration> clinicalAssessmentOptional = otRegistrationRepository.findById(id);
		if(clinicalAssessmentOptional.isPresent()){
			otRegistrationRepository.delete(clinicalAssessmentOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}

	private OTRegistrationDTO getOTRegistrationDTO(OTRegistration otRegistration) {
		OTRegistrationDTO otRegistrationDTO = otRegistrationMapper.otRegistrationToOTRegistrationDTO(otRegistration);

		if(Objects.nonNull(otRegistrationDTO) && Objects.nonNull(otRegistrationDTO.getAppointmentId())){

			if(Objects.nonNull(otRegistrationDTO.getPatientId())){
				Optional<Patient> patientOptional = patientRepository.findByPatientId(otRegistrationDTO.getPatientId());
				if(patientOptional.isPresent()){
					Patient patient = patientOptional.get();
					otRegistrationDTO.setNamePrefix(patient.getNamePrefix());
					otRegistrationDTO.setFirstName(patient.getFirstName());
					otRegistrationDTO.setFatherName(patient.getFatherName());
					otRegistrationDTO.setLastName(patient.getLastName());
					otRegistrationDTO.setGender(patient.getGender());
					otRegistrationDTO.setMaritalStatus(patient.getMaritalStatus());
					otRegistrationDTO.setMobileNumber(patient.getMobileNumber());
					otRegistrationDTO.setMiddleName(patient.getMiddleName());
					otRegistrationDTO.setDob(patient.getDob());
					otRegistrationDTO.setPatientUHIDNumber(patient.getDocumentNumber());
				}
			}
			if(Objects.nonNull(otRegistrationDTO.getAppointmentId())){
				Optional<Appointment> appointmentOptional = appointmentRepository.findById(otRegistrationDTO.getAppointmentId());
				if(appointmentOptional.isPresent()){
					Appointment appointment = appointmentOptional.get();
					otRegistrationDTO.setAppointmentNumber(appointment.getDocumentNumber());
					otRegistrationDTO.setAadharNumber(appointment.getAadharNumber());
					otRegistrationDTO.setAddress(appointment.getAddress());
				}
			}
		}
		return otRegistrationDTO;
	}
}