package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.AssessmentVital;
import com.codecraft.master.entities.ClinicalAssessment;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.AssessmentVitalMapper;
import com.codecraft.master.mappers.ClinicalAssessmentMapper;
import com.codecraft.master.mappers.PatientMapper;
import com.codecraft.master.models.AssessmentVitalDTO;
import com.codecraft.master.models.ClinicalAssessmentDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PatientDTO;
import com.codecraft.master.repositories.AppointmentRepository;
import com.codecraft.master.repositories.AssessmentVitalRepository;
import com.codecraft.master.repositories.ClinicalAssessmentRepository;
import com.codecraft.master.repositories.PatientRepository;
import com.codecraft.master.specifications.ClinicalAssessmentSpecification;
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
public class ClinicalAssessmentService {

	@Autowired
	ClinicalAssessmentRepository clinicalAssessmentRepository;

	@Autowired
	ClinicalAssessmentMapper clinicalAssessmentMapper;

	@Autowired
	AssessmentVitalRepository assessmentVitalRepository;

	@Autowired
	AssessmentVitalMapper assessmentVitalMapper;

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	PatientService patientService;

	@Autowired
	AppointmentRepository appointmentRepository;
	@Autowired
	PatientMapper patientMapper;
	public MasterManagerResponse search(ClinicalAssessmentDTO reqDomain) {
		log.info("ClinicalAssessmentService : search() started reqDomain {}", reqDomain);
		try {
			Specification<ClinicalAssessment> spec = Specification.where(ClinicalAssessmentSpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(ClinicalAssessmentSpecification.withIsActive(1)));

			if(Objects.nonNull(reqDomain.getId())){
				spec = spec.and(Specification.where(ClinicalAssessmentSpecification.withId(reqDomain.getId())));
			}

			if(Objects.nonNull(reqDomain.getAppointmentId())){
				spec = spec.and(Specification.where(ClinicalAssessmentSpecification.withAppointmentId(reqDomain.getAppointmentId())));
			}

			if(Objects.nonNull(reqDomain.getPatientId())){
				spec = spec.and(Specification.where(ClinicalAssessmentSpecification.withPatientId(reqDomain.getPatientId())));
			}

			List<ClinicalAssessment> clinicalAssessmentList = clinicalAssessmentRepository.findAll(spec);
			List<ClinicalAssessmentDTO> clinicalAssessmentDTOList = new ArrayList<>();
			clinicalAssessmentList.forEach(clinicalAssessment -> {
				clinicalAssessmentDTOList.add(getClinicalAssessmentDTO(clinicalAssessment));
			});

			return new MasterManagerResponse(MasterConstant.SUCCESS, clinicalAssessmentDTOList);
		} catch (Exception e) {
			log.error("ClinicalAssessmentService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(ClinicalAssessmentDTO reqDomainDTO) {
		log.info("ClinicalAssessmentService : save() started reqDomain {}", reqDomainDTO);
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

			ClinicalAssessment reqDomain = clinicalAssessmentMapper.clinicalAssessmentDTOToClinicalAssessment(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = clinicalAssessmentRepository.save(reqDomain);


			if(!CollectionUtils.isEmpty(reqDomainDTO.getAssessmentVitalDTOList())){
				ClinicalAssessment finalReqDomain = reqDomain;
				reqDomainDTO.getAssessmentVitalDTOList().forEach(assessmentVitalDTO -> {
					AssessmentVital assessmentVital = assessmentVitalRepository.save(assessmentVitalMapper.assessmentVitalDTOToAssessmentVital(assessmentVitalDTO));
					finalReqDomain.setAssessmentVitalId(assessmentVital.getId());
				});
			}
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, getClinicalAssessmentDTO(reqDomain));
		} catch (Exception e) {
			log.error("ClinicalAssessmentService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
    public MasterManagerResponse update(ClinicalAssessmentDTO reqDomainDTO) {
		log.info("ClinicalAssessmentService : update() started reqDomain {}", reqDomainDTO);
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

			ClinicalAssessment reqDomain = clinicalAssessmentMapper.clinicalAssessmentDTOToClinicalAssessment(reqDomainDTO);
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			reqDomain = clinicalAssessmentRepository.save(reqDomain);



			if(!CollectionUtils.isEmpty(reqDomainDTO.getAssessmentVitalDTOList())){
				ClinicalAssessment finalReqDomain = reqDomain;
				reqDomainDTO.getAssessmentVitalDTOList().forEach(assessmentVitalDTO -> {
					AssessmentVital assessmentVital = assessmentVitalRepository.save(assessmentVitalMapper.assessmentVitalDTOToAssessmentVital(assessmentVitalDTO));
					finalReqDomain.setAssessmentVitalId(assessmentVital.getId());
				});
			}

			return new MasterManagerResponse(MasterConstant.DATA_SAVED, getClinicalAssessmentDTO(reqDomain));
		} catch (Exception e) {
			log.error("ClinicalAssessmentService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

	@Transactional
	public MasterManagerResponse delete(Integer id) {
		log.info("ClinicalAssessmentService : delete() started reqDomain {}", id);
		Optional<ClinicalAssessment> clinicalAssessmentOptional = clinicalAssessmentRepository.findById(id);
		if(clinicalAssessmentOptional.isPresent()){
			clinicalAssessmentRepository.delete(clinicalAssessmentOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}

	private ClinicalAssessmentDTO getClinicalAssessmentDTO(ClinicalAssessment clinicalAssessment) {
		ClinicalAssessmentDTO clinicalAssessmentDTO = clinicalAssessmentMapper.clinicalAssessmentToClinicalAssessmentDTO(clinicalAssessment);

		if(Objects.nonNull(clinicalAssessmentDTO)){

			List<AssessmentVital> assessmentVitalList  = assessmentVitalRepository.findByAppointmentIdOrderByCreatedDateDesc(clinicalAssessmentDTO.getAppointmentId());
			List<AssessmentVitalDTO> assessmentVitalDTOList = new ArrayList<>();
			assessmentVitalList.forEach(assessmentVital -> {
				assessmentVitalDTOList.add(assessmentVitalMapper.assessmentVitalToAssessmentVitalDTO(assessmentVital));
			});
			if(Objects.nonNull(clinicalAssessment.getPatientId())){
				Optional<Patient> patientOptional = patientRepository.findByPatientId(clinicalAssessment.getPatientId());
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
					clinicalAssessmentDTO.setPatientDetails(patientDTO);
				}
			}
			if(Objects.nonNull(clinicalAssessment.getAppointmentId())){
				Optional<Appointment> appointmentOptional = appointmentRepository.findById(clinicalAssessment.getAppointmentId());
				if(appointmentOptional.isPresent()){
					Appointment appointment = appointmentOptional.get();
					clinicalAssessmentDTO.setAppointmentNumber(appointment.getDocumentNumber());
				}
			}
			clinicalAssessmentDTO.setAssessmentVitalDTOList(assessmentVitalDTOList);
		}
		return clinicalAssessmentDTO;
	}
}