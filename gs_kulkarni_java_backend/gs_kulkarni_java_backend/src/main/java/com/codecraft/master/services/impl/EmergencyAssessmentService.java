package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.AssessmentVitalMapper;
import com.codecraft.master.mappers.EmergencyAssessmentMapper;
import com.codecraft.master.mappers.PatientMapper;
import com.codecraft.master.models.AssessmentVitalDTO;
import com.codecraft.master.models.EmergencyAssessmentDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PatientDTO;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.EmergencyAssessmentSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class EmergencyAssessmentService {

	@Autowired
	EmergencyAssessmentRepository emergencyAssessmentRepository;

	@Autowired
	EmergencyAssessmentMapper emergencyAssessmentMapper;

	@Autowired
	AssessmentVitalRepository assessmentVitalRepository;

	@Autowired
	AssessmentVitalMapper assessmentVitalMapper;

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	AppointmentRepository appointmentRepository;

	@Autowired
	PatientService patientService;

	@Autowired
	PatientMapper patientMapper;

	public MasterManagerResponse search(EmergencyAssessmentDTO reqDomain) {
		log.info("ClinicalAssessmentService : search() started reqDomain {}", reqDomain);
		try {
			Specification<EmergencyAssessment> spec = Specification.where(EmergencyAssessmentSpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(EmergencyAssessmentSpecification.withIsActive(1)));

			if(Objects.nonNull(reqDomain.getId())){
				spec = spec.and(Specification.where(EmergencyAssessmentSpecification.withId(reqDomain.getId())));
			}

			if(Objects.nonNull(reqDomain.getPatientId())){
				spec = spec.and(Specification.where(EmergencyAssessmentSpecification.withPatientId(reqDomain.getPatientId())));
			}

			List<EmergencyAssessment> clinicalAssessmentList = emergencyAssessmentRepository.findAll(spec);
			List<EmergencyAssessmentDTO> clinicalAssessmentDTOList = new ArrayList<>();
			clinicalAssessmentList.forEach(clinicalAssessment -> {
				clinicalAssessmentDTOList.add(getEmergencyAssessmentDTO(clinicalAssessment));
			});

			return new MasterManagerResponse(MasterConstant.SUCCESS, clinicalAssessmentDTOList);
		} catch (Exception e) {
			log.error("EmergencyAssessmentService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(EmergencyAssessmentDTO reqDomainDTO) {
		log.info("EmergencyAssessmentService : save() started reqDomain {}", reqDomainDTO);
		try {


			if(Objects.isNull(reqDomainDTO.getPatientId())){
				Patient patient = (Patient) patientService.save(reqDomainDTO.getPatientDetails()).getData();
				reqDomainDTO.setPatientId(patient.getPatientId());
			}

			if(Objects.nonNull(reqDomainDTO.getPatientId())){
				Optional<Patient>  patientOptional = patientRepository.findByPatientId(reqDomainDTO.getPatientId());
				if(patientOptional.isPresent()){
					reqDomainDTO.setDob(patientOptional.get().getDob());
					reqDomainDTO.setGender(patientOptional.get().getGender());
					reqDomainDTO.setFatherName(patientOptional.get().getFatherName());
					reqDomainDTO.setMiddleName(patientOptional.get().getMiddleName());
					reqDomainDTO.setFirstName(patientOptional.get().getFirstName());
					reqDomainDTO.setNamePrefix(patientOptional.get().getNamePrefix());
					reqDomainDTO.setLastName(patientOptional.get().getLastName());
					reqDomainDTO.setMobileNumber(patientOptional.get().getMobileNumber());
					reqDomainDTO.setMaritalStatus(patientOptional.get().getMaritalStatus());
					reqDomainDTO.setPatientUHIDNumber(patientOptional.get().getDocumentNumber());
				}
			}

			EmergencyAssessment reqDomain = emergencyAssessmentMapper.emergencyAssessmentDTOToEmergencyAssessment(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = emergencyAssessmentRepository.save(reqDomain);

			if(!CollectionUtils.isEmpty(reqDomainDTO.getAssessmentVitalDTOList())){
				EmergencyAssessment finalReqDomain = reqDomain;
				reqDomainDTO.getAssessmentVitalDTOList().forEach(assessmentVitalDTO -> {
					AssessmentVital assessmentVital = assessmentVitalRepository.save(assessmentVitalMapper.assessmentVitalDTOToAssessmentVital(assessmentVitalDTO));
					finalReqDomain.setAssessmentVitalId(assessmentVital.getId());
				});
			}
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, getEmergencyAssessmentDTO(reqDomain));
		} catch (Exception e) {
			log.error("EmergencyAssessmentService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
    public MasterManagerResponse update(EmergencyAssessmentDTO reqDomainDTO) {
		log.info("EmergencyAssessmentService : update() started reqDomain {}", reqDomainDTO);
		try {
			if(Objects.nonNull(reqDomainDTO.getPatientId())){
				Optional<Patient>  patientOptional = patientRepository.findByPatientId(reqDomainDTO.getPatientId());
				if(patientOptional.isPresent()){
					reqDomainDTO.setDob(patientOptional.get().getDob());
					reqDomainDTO.setGender(patientOptional.get().getGender());
					reqDomainDTO.setFatherName(patientOptional.get().getFatherName());
					reqDomainDTO.setMiddleName(patientOptional.get().getMiddleName());
					reqDomainDTO.setFirstName(patientOptional.get().getFirstName());
					reqDomainDTO.setNamePrefix(patientOptional.get().getNamePrefix());
					reqDomainDTO.setLastName(patientOptional.get().getLastName());
					reqDomainDTO.setMobileNumber(patientOptional.get().getMobileNumber());
					reqDomainDTO.setMaritalStatus(patientOptional.get().getMaritalStatus());
					reqDomainDTO.setPatientUHIDNumber(patientOptional.get().getDocumentNumber());
				}
			}

			EmergencyAssessment reqDomain = emergencyAssessmentMapper.emergencyAssessmentDTOToEmergencyAssessment(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());

			reqDomain = emergencyAssessmentRepository.save(reqDomain);

			if(!CollectionUtils.isEmpty(reqDomainDTO.getAssessmentVitalDTOList())){
				EmergencyAssessment finalReqDomain = reqDomain;
				reqDomainDTO.getAssessmentVitalDTOList().forEach(assessmentVitalDTO -> {
					AssessmentVital assessmentVital = assessmentVitalRepository.save(assessmentVitalMapper.assessmentVitalDTOToAssessmentVital(assessmentVitalDTO));
					finalReqDomain.setAssessmentVitalId(assessmentVital.getId());
				});
			}

			return new MasterManagerResponse(MasterConstant.DATA_SAVED, getEmergencyAssessmentDTO(reqDomain));
		} catch (Exception e) {
			log.error("EmergencyAssessmentService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

	@Transactional
	public MasterManagerResponse delete(Integer id) {
		log.info("EmergencyAssessmentService : delete() started reqDomain {}", id);
		Optional<EmergencyAssessment> clinicalAssessmentOptional = emergencyAssessmentRepository.findById(id);
		if(clinicalAssessmentOptional.isPresent()){
			emergencyAssessmentRepository.delete(clinicalAssessmentOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}

	private EmergencyAssessmentDTO getEmergencyAssessmentDTO(EmergencyAssessment emergencyAssessment) {
		EmergencyAssessmentDTO emergencyAssessmentDTO = emergencyAssessmentMapper.emergencyAssessmentToEmergencyAssessmentDTO(emergencyAssessment);

		if(Objects.nonNull(emergencyAssessmentDTO)){
			List<AssessmentVital> assessmentVitalList  = assessmentVitalRepository.findByAppointmentIdOrderByCreatedDateDesc(emergencyAssessmentDTO.getAppointmentId());
			List<AssessmentVitalDTO> assessmentVitalDTOList = new ArrayList<>();
			assessmentVitalList.forEach(assessmentVital -> {
				assessmentVitalDTOList.add(assessmentVitalMapper.assessmentVitalToAssessmentVitalDTO(assessmentVital));
			});
			if(Objects.nonNull(emergencyAssessment.getPatientId())){
				Optional<Patient> patientOptional = patientRepository.findByPatientId(emergencyAssessment.getPatientId());
				if(patientOptional.isPresent()){
					Patient patient = patientOptional.get();
					PatientDTO patientDTO = new PatientDTO();
					patientDTO.setNamePrefix(patient.getNamePrefix());
					patientDTO.setFirstName(patient.getFirstName());
					patientDTO.setFatherName(patient.getFatherName());
					patientDTO.setLastName(patient.getLastName());
					patientDTO.setGender(patient.getGender());
					patientDTO.setMaritalStatus(patient.getMaritalStatus());
					patientDTO.setMobileNumber(patient.getMobileNumber());
					patientDTO.setMiddleName(patient.getMiddleName());
					patientDTO.setDob(patient.getDob());
					patientDTO.setPatientUHIDNumber(patient.getDocumentNumber());
					emergencyAssessmentDTO.setPatientDetails(patientDTO);
				}
			}
			if(Objects.nonNull(emergencyAssessment.getAppointmentId())){
				Optional<Appointment> appointmentOptional = appointmentRepository.findById(emergencyAssessment.getAppointmentId());
				if(appointmentOptional.isPresent()){
					Appointment appointment = appointmentOptional.get();
					emergencyAssessmentDTO.setAppointmentNumber(appointment.getDocumentNumber());
				}
			}
			emergencyAssessmentDTO.setAssessmentVitalDTOList(assessmentVitalDTOList);
		}
		return emergencyAssessmentDTO;
	}
}