package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.Hospital;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.PatientMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PatientDTO;
import com.codecraft.master.repositories.AppointmentRepository;
import com.codecraft.master.repositories.PatientRepository;
import com.codecraft.master.specifications.PatientSpecification;
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
public class PatientService {

	@Autowired
	PatientRepository patientRepository;

	@Autowired
	AppointmentRepository appointmentRepository;

	@Autowired
	PatientMapper patientMapper;

	@Autowired
	ServiceHelper serviceHelper;

	@Transactional
	public MasterManagerResponse save(PatientDTO reqDomain) {
		log.info("PatientService: save() PatientDomain {}", reqDomain);
		try {

			reqDomain.setHospitalId(UserContext.getHospitalId());
			boolean isPatientExist = false;
			Integer patientId = null;
			Patient patient = new Patient();
			Appointment appointment = new Appointment();
			Optional<Appointment> appointmentOptional  = null;
			if (reqDomain.getAppointmentId() != null && reqDomain.getAppointmentId() != 0) {
				appointmentOptional = appointmentRepository.findById(reqDomain.getAppointmentId());

				if (appointmentOptional.isPresent()) {
					appointment = appointmentOptional.get();
					if (appointment.getPatientId() != null && appointment.getPatientId() != 0) {
						isPatientExist = true;
						patient.setPatientId(appointment.getPatientId());
					} else {
						Optional<Patient> patientOptional = patientRepository
								.findByHospitalIdAndMobileNumberAndFirstNameAndLastName(UserContext.getHospitalId(),
										appointment.getMobileNumber(), appointment.getFirstName(),
										appointment.getLastName());
						if (!patientOptional.isPresent()) {
							reqDomain.setFirstName(appointment.getFirstName());
							reqDomain.setLastName(appointment.getLastName());
							reqDomain.setMiddleName(appointment.getMiddleName());
							reqDomain.setHospitalId(UserContext.getHospitalId());
							reqDomain.setGender(appointment.getGender());
							reqDomain.setAddress(appointment.getAddress());
							reqDomain.setMobileNumber(appointment.getMobileNumber());
						} else {
							patientId = patientOptional.get().getPatientId();
							isPatientExist = true; 
						}
					}

				}
			}
			if (!isPatientExist) {
				patient = patientMapper.patientDTOToPatient(reqDomain);
				patient.setActiveInd(1);
				patient.setDocumentNumber(serviceHelper.randomDigitsUHID());
				patient = patientRepository.save(patient);
			}
			if (appointmentOptional != null && appointmentOptional.isPresent() && patientId != null) {
				appointment.setPatientId(patientId);
				appointmentRepository.save(appointment);
			}
				return new MasterManagerResponse(MasterConstant.DATA_SAVED, patient);
		} catch (Exception e) {
			log.error("PatientService : save() Exception occured while saving company information", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse search(Patient reqDomain) {
		log.info("PatientService : search() started PatientDomain {}", reqDomain);
		try {

			Specification<Patient> spec = Specification.where(PatientSpecification.withHospitalId(UserContext.getHospitalId()));
			spec = spec.and(Specification.where(PatientSpecification.withIsActive(1)));
			if(Objects.nonNull(reqDomain.getState())){
				spec = spec.and(Specification.where(PatientSpecification.withState(reqDomain.getState())));
			}
			if(Objects.nonNull(reqDomain.getMobileNumber())){
				spec = spec.and(Specification.where(PatientSpecification.withMobileNumber(reqDomain.getMobileNumber())));
			}

			if(Objects.nonNull(reqDomain.getFirstName())){
				spec = spec.and(Specification.where(PatientSpecification.withFirstName(reqDomain.getFirstName())));
			}

			if(Objects.nonNull(reqDomain.getLastName())){
				spec = spec.and(Specification.where(PatientSpecification.withLastName(reqDomain.getLastName())));
			}

			List<Patient> result = patientRepository.findAll(spec);
			return new MasterManagerResponse(MasterConstant.SUCCESS, result);
		} catch (Exception e) {
			log.error("PatientService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse update(Patient reqDomain) {
		log.info("PatientService : update() started PatientDomain {}", reqDomain);
		try {
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY, patientRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("PatientService : update() Exception occured while update user information", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



}
