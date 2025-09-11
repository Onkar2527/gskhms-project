package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.ContinuationSheet;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.ContinuationSheetMapper;
import com.codecraft.master.models.ContinuationSheetDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.AppointmentRepository;
import com.codecraft.master.repositories.ContinuationSheetRepository;
import com.codecraft.master.repositories.PatientRepository;
import com.codecraft.master.specifications.ContinuationSheetSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class ContinuationSheetService {

	@Autowired
	ContinuationSheetRepository continuationSheetRepository;

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	AppointmentRepository appointmentRepository;

	@Autowired
	ContinuationSheetMapper continuationSheetMapper;

	public MasterManagerResponse search(ContinuationSheetDTO reqDomain) {
		log.info("AssessmentVitalService : search() started reqDomain {}", reqDomain);
		try {
			Specification<ContinuationSheet> spec = Specification.where(ContinuationSheetSpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(ContinuationSheetSpecification.withIsActive(1)));

			if (Objects.nonNull(reqDomain.getId())) {
				spec = spec.and(Specification.where(ContinuationSheetSpecification.withId(reqDomain.getId())));
			}

			if (Objects.nonNull(reqDomain.getAppointmentId())) {
				spec = spec.and(Specification.where(ContinuationSheetSpecification.withAppointmentId(reqDomain.getAppointmentId())));
			}

			List<ContinuationSheet> clinicalAssessmentList = continuationSheetRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "noteTime"));
			List<ContinuationSheetDTO> nursingAssessmentDTOList = new ArrayList<>();
			clinicalAssessmentList.forEach(clinicalAssessment ->
					nursingAssessmentDTOList.add(getContinuationSheet(clinicalAssessment)));

			return new MasterManagerResponse(MasterConstant.SUCCESS, nursingAssessmentDTOList);

		} catch (Exception e) {
			log.error("AssessmentVitalService : search() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(ContinuationSheetDTO reqDomainDTO) {
		log.info("AssessmentVitalService : save() started reqDomain {}", reqDomainDTO);
		try {
			ContinuationSheet reqDomain = continuationSheetMapper.continuationSheetDTOToContinuationSheet(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = continuationSheetRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("AssessmentVitalService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
    public MasterManagerResponse update(ContinuationSheetDTO reqDomainDTO) {
		log.info("AssessmentVitalService : update() started reqDomain {}", reqDomainDTO);
		try {
			ContinuationSheet reqDomain = continuationSheetMapper.continuationSheetDTOToContinuationSheet(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = continuationSheetRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("AssessmentVitalService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

	@Transactional
	public MasterManagerResponse delete(Integer id) {
		log.info("AssessmentVitalService : delete() started reqDomain {}", id);
		Optional<ContinuationSheet> clinicalAssessmentOptional = continuationSheetRepository.findById(id);
		if(clinicalAssessmentOptional.isPresent()){
			continuationSheetRepository.delete(clinicalAssessmentOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}



	private ContinuationSheetDTO getContinuationSheet(ContinuationSheet nursingAssessment) {
		ContinuationSheetDTO nursingAssessmentDTO = continuationSheetMapper.continuationSheetToContinuationSheetDTO(nursingAssessment);

		if (Objects.nonNull(nursingAssessmentDTO) && Objects.nonNull(nursingAssessmentDTO.getAppointmentId())) {


			if (Objects.nonNull(nursingAssessment.getAppointmentId())) {
				Optional<Appointment> appointmentOptional = appointmentRepository.findById(nursingAssessment.getAppointmentId());
				if (appointmentOptional.isPresent()) {
					Appointment appointment = appointmentOptional.get();
					nursingAssessmentDTO.setAppointmentNumber(appointment.getDocumentNumber());


					if (Objects.nonNull(appointment.getPatientId())) {
						Optional<Patient> patientOptional = patientRepository.findByPatientId(appointment.getPatientId());
						if (patientOptional.isPresent()) {
							Patient patient = patientOptional.get();
							nursingAssessmentDTO.setNamePrefix(patient.getNamePrefix());
							nursingAssessmentDTO.setFirstName(patient.getFirstName());
							nursingAssessmentDTO.setFatherName(patient.getFatherName());
							nursingAssessmentDTO.setLastName(patient.getLastName());
							nursingAssessmentDTO.setGender(patient.getGender());
							nursingAssessmentDTO.setMaritalStatus(patient.getMaritalStatus());
							nursingAssessmentDTO.setMobileNumber(patient.getMobileNumber());
							nursingAssessmentDTO.setMiddleName(patient.getMiddleName());
							nursingAssessmentDTO.setDob(patient.getDob());
							nursingAssessmentDTO.setPatientUHIDNumber(patient.getDocumentNumber());
						}
					}

				}
			}
		}
		return nursingAssessmentDTO;
	}
}
