package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.AssessmentVital;
import com.codecraft.master.entities.ContinuationSheet;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.AssessmentVitalMapper;
import com.codecraft.master.models.AssessmentVitalDTO;
import com.codecraft.master.models.ContinuationSheetDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.AppointmentRepository;
import com.codecraft.master.repositories.AssessmentVitalRepository;
import com.codecraft.master.repositories.PatientRepository;
import com.codecraft.master.specifications.AssessmentVitalSpecification;
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
public class AssessmentVitalService {

	@Autowired
	AssessmentVitalRepository assessmentVitalRepository;

	@Autowired
	AssessmentVitalMapper assessmentVitalMapper;

	@Autowired
	AppointmentRepository appointmentRepository;

	@Autowired
	PatientRepository patientRepository;

	public MasterManagerResponse search(AssessmentVitalDTO reqDomain) {
		log.info("AssessmentVitalService : search() started reqDomain {}", reqDomain);
		try {

			Specification<AssessmentVital> spec = Specification.where(AssessmentVitalSpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(AssessmentVitalSpecification.withIsActive(1)));

			if (Objects.nonNull(reqDomain.getId())) {
				spec = spec.and(Specification.where(AssessmentVitalSpecification.withId(reqDomain.getId())));
			}

			if (Objects.nonNull(reqDomain.getAppointmentId())) {
				spec = spec.and(Specification.where(AssessmentVitalSpecification.withAppointmentId(reqDomain.getAppointmentId())));
			}

			List<AssessmentVital> clinicalAssessmentList = assessmentVitalRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "measureTime"));
			List<AssessmentVitalDTO> nursingAssessmentDTOList = new ArrayList<>();
			clinicalAssessmentList.forEach(clinicalAssessment ->
					nursingAssessmentDTOList.add(getAssessmentVital(clinicalAssessment)));

			return new MasterManagerResponse(MasterConstant.SUCCESS, nursingAssessmentDTOList);
		} catch (Exception e) {
			log.error("AssessmentVitalService : search() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private AssessmentVitalDTO getAssessmentVital(AssessmentVital nursingAssessment) {

		AssessmentVitalDTO nursingAssessmentDTO = assessmentVitalMapper.assessmentVitalToAssessmentVitalDTO(nursingAssessment);

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

	@Transactional
	public MasterManagerResponse save(AssessmentVitalDTO reqDomainDTO) {
		log.info("AssessmentVitalService : save() started reqDomain {}", reqDomainDTO);
		try {
			AssessmentVital reqDomain = assessmentVitalMapper.assessmentVitalDTOToAssessmentVital(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = assessmentVitalRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("AssessmentVitalService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
    public MasterManagerResponse update(AssessmentVitalDTO reqDomainDTO) {
		log.info("AssessmentVitalService : update() started reqDomain {}", reqDomainDTO);
		try {
			AssessmentVital reqDomain = assessmentVitalMapper.assessmentVitalDTOToAssessmentVital(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = assessmentVitalRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
		} catch (Exception e) {
			log.error("AssessmentVitalService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

	@Transactional
	public MasterManagerResponse delete(Integer id) {
		log.info("AssessmentVitalService : delete() started reqDomain {}", id);
		Optional<AssessmentVital> clinicalAssessmentOptional = assessmentVitalRepository.findById(id);
		if(clinicalAssessmentOptional.isPresent()){
			assessmentVitalRepository.delete(clinicalAssessmentOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}
}
