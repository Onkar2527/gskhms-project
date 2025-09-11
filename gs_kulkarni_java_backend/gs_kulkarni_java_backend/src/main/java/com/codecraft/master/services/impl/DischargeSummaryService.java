package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.AssessmentVitalMapper;
import com.codecraft.master.mappers.DischargeSummaryMapper;
import com.codecraft.master.models.AssessmentVitalDTO;
import com.codecraft.master.models.DischargeSummaryDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.DischargeSummarySpecification;
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
public class DischargeSummaryService {
	
	@Autowired
	DischargeSummaryRepository dischargeSummaryRepository;

	@Autowired
	AppointmentRepository appointmentRepository;

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	ClinicalAssessmentRepository clinicalAssessmentRepository;


	@Autowired
	EmergencyAssessmentRepository emergencyAssessmentRepository;

	@Autowired
	EmployeeRepository employeeRepository;

	@Autowired
	AssessmentVitalRepository assessmentVitalRepository;

	@Autowired
	AssessmentVitalMapper assessmentVitalMapper;

	@Autowired
	AppointmentBedAssignService appointmentBedAssignService;

	@Autowired
	DischargeSummaryMapper mapper;

	public MasterManagerResponse search(DischargeSummary reqDomain) {
		log.info("DischargeSummaryService : search() started reqDomain {}", reqDomain);
		try {
			Specification<DischargeSummary> spec = Specification.where(DischargeSummarySpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(DischargeSummarySpecification.withIsActive(1)));

			if(Objects.nonNull(reqDomain.getId())){
				spec = spec.and(Specification.where(DischargeSummarySpecification.withId(reqDomain.getId())));
			}

			if(Objects.nonNull(reqDomain.getAppointmentId())){
				spec = spec.and(Specification.where(DischargeSummarySpecification.withAppointmentId(reqDomain.getAppointmentId())));
			}

			List<DischargeSummary> dischargeSummaryList = dischargeSummaryRepository.findAll(spec);
			List<DischargeSummaryDTO> dischargeSummaryDTOList = new ArrayList<>();
			dischargeSummaryList.forEach(dischargeSummary -> {
				dischargeSummaryDTOList.add(getDischargeSummaryDTO(dischargeSummary));
			});

			return new MasterManagerResponse(MasterConstant.SUCCESS, dischargeSummaryDTOList);
		} catch (Exception e) {
			log.error("DischargeSummaryService : search() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private DischargeSummaryDTO getDischargeSummaryDTO(DischargeSummary dischargeSummary) {
		DischargeSummaryDTO dischargeSummaryDTO = mapper.dischargeSummaryToDischargeSummaryDTO(dischargeSummary);

		if(Objects.nonNull(dischargeSummary.getAppointmentId())){
			Optional<Appointment> appointmentOptional = appointmentRepository.findById(dischargeSummary.getAppointmentId());
			if(appointmentOptional.isPresent()){
				Appointment appointment = appointmentOptional.get();
				dischargeSummaryDTO.setPatient(patientRepository.findByPatientId(appointment.getPatientId()).orElse(null));

				dischargeSummaryDTO.setAdmissionDate(appointment.getDischargeDate());
				dischargeSummaryDTO.setDischargeNote(appointment.getDischargeNote());
				dischargeSummaryDTO.setDischargeStatus(appointment.getDischargeStatus());

				if (Objects.nonNull(appointment.getDoctorId())) {
					dischargeSummaryDTO.setDoctorId(appointment.getDoctorId());
					Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getDoctorId());
					employeeOptional.ifPresent(employee -> dischargeSummaryDTO.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
				}
				if (Objects.nonNull(appointment.getSecDoctorId())) {
					dischargeSummaryDTO.setSecDoctorId(appointment.getSecDoctorId());
					Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getSecDoctorId());
					employeeOptional.ifPresent(employee -> dischargeSummaryDTO.setSecDoctorName(employee.getFirstName() + " " + employee.getLastName()));
				}

				Optional<ClinicalAssessment> clinicalAssessmentOptional = clinicalAssessmentRepository.findByAppointmentId(appointment.getId()).stream().findFirst();
				if(clinicalAssessmentOptional.isPresent()){
					ClinicalAssessment clinicalAssessment = clinicalAssessmentOptional.get();
					dischargeSummaryDTO.setAdmissionDate(clinicalAssessment.getAdmissionDate());
					dischargeSummaryDTO.setProvisionalDiagnosis(clinicalAssessment.getProvisionalDiagnosis());
					dischargeSummaryDTO.setFinalDiagnosis(clinicalAssessment.getFinalDiagnosis());
					dischargeSummaryDTO.setChiefComplaint(clinicalAssessment.getChiefComplaint());
				}else {

					Optional<EmergencyAssessment> emergencyAssessmentOptional = emergencyAssessmentRepository.findByAppointmentId(appointment.getId()).stream().findFirst();
					if (emergencyAssessmentOptional.isPresent()) {
						EmergencyAssessment emergencyAssessment = emergencyAssessmentOptional.get();
						dischargeSummaryDTO.setAdmissionDate(emergencyAssessment.getAdmissionDate());
						dischargeSummaryDTO.setChiefComplaint(emergencyAssessment.getEventsLeadingToTrauma());
					}
				}
				List<AssessmentVital> assessmentVitalList  = assessmentVitalRepository.findByAppointmentIdOrderByCreatedDateDesc(dischargeSummary.getAppointmentId());
				List<AssessmentVitalDTO> assessmentVitalDTOList = new ArrayList<>();
				if(!CollectionUtils.isEmpty(assessmentVitalList)) {
					assessmentVitalDTOList.add(assessmentVitalMapper.assessmentVitalToAssessmentVitalDTO(assessmentVitalList.get(0)));
					assessmentVitalDTOList.add(assessmentVitalMapper.assessmentVitalToAssessmentVitalDTO(assessmentVitalList.get(assessmentVitalList.size()-1)));
				}
				dischargeSummaryDTO.setAssessmentVitalDTOList(assessmentVitalDTOList);
			}
		}
		return dischargeSummaryDTO;
	}

	@Transactional
	public MasterManagerResponse save(DischargeSummary reqDomain) {
		log.info("BankService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());
			appointmentBedAssignService.calculateBedBill(reqDomain.getAppointmentId());
			return new MasterManagerResponse(MasterConstant.DATA_SAVED,dischargeSummaryRepository.save(reqDomain));

		} catch (Exception e) {
			log.error("DischargeSummaryService : save() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse update(DischargeSummary reqDomain) {
		log.info("DischargeSummaryService : update() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY,dischargeSummaryRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("DischargeSummaryService : update() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse delete(Integer id) {
		log.info("BankService : delete() started id {}", id);
		try {
			dischargeSummaryRepository.deleteById(id);
			return new MasterManagerResponse(MasterConstant.DATA_DELETE);
		} catch (Exception e) {
			log.error("DischargeSummaryService : delete() Exception occurred while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
