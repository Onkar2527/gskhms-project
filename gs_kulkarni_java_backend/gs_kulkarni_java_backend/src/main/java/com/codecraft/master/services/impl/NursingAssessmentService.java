package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.AssessmentVital;
import com.codecraft.master.entities.NursingAssessment;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.AssessmentVitalMapper;
import com.codecraft.master.mappers.NursingAssessmentMapper;
import com.codecraft.master.models.AssessmentVitalDTO;
import com.codecraft.master.models.NursingAssessmentDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.AppointmentRepository;
import com.codecraft.master.repositories.AssessmentVitalRepository;
import com.codecraft.master.repositories.NursingAssessmentRepository;
import com.codecraft.master.repositories.PatientRepository;
import com.codecraft.master.specifications.NursingAssessmentSpecification;
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
public class NursingAssessmentService {

    @Autowired
    NursingAssessmentRepository nursingAssessmentRepository;

    @Autowired
    NursingAssessmentMapper nursingAssessmentMapper;

    @Autowired
    AssessmentVitalRepository assessmentVitalRepository;

    @Autowired
    AssessmentVitalMapper assessmentVitalMapper;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    public MasterManagerResponse search(NursingAssessmentDTO reqDomain) {
        log.info("NursingAssessmentService : search() started reqDomain {}", reqDomain);
        try {
            Specification<NursingAssessment> spec = Specification.where(NursingAssessmentSpecification.withHospitalId(UserContext.getHospitalId()));
            spec = spec.and(Specification.where(NursingAssessmentSpecification.withIsActive(1)));

            if (Objects.nonNull(reqDomain.getId())) {
                spec = spec.and(Specification.where(NursingAssessmentSpecification.withId(reqDomain.getId())));
            }

            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                spec = spec.and(Specification.where(NursingAssessmentSpecification.withAppointmentId(reqDomain.getAppointmentId())));
            }

            if (Objects.nonNull(reqDomain.getPatientId())) {
                spec = spec.and(Specification.where(NursingAssessmentSpecification.withPatientId(reqDomain.getPatientId())));
            }

            List<NursingAssessment> clinicalAssessmentList = nursingAssessmentRepository.findAll(spec);
            List<NursingAssessmentDTO> nursingAssessmentDTOList = new ArrayList<>();
            clinicalAssessmentList.forEach(clinicalAssessment ->
                    nursingAssessmentDTOList.add(getNursingAssessmentDTO(clinicalAssessment)));

            return new MasterManagerResponse(MasterConstant.SUCCESS, nursingAssessmentDTOList);
        } catch (Exception e) {
            log.error("NursingAssessmentService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(NursingAssessmentDTO reqDomainDTO) {
        log.info("NursingAssessmentService : save() started reqDomain {}", reqDomainDTO);
        try {
            NursingAssessment reqDomain = nursingAssessmentMapper.nursingAssessmentDTOToNursingAssessment(reqDomainDTO);
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = nursingAssessmentRepository.save(reqDomain);

            if (!CollectionUtils.isEmpty(reqDomainDTO.getAssessmentVitalDTOList())) {
                NursingAssessment finalReqDomain = reqDomain;
                reqDomainDTO.getAssessmentVitalDTOList().forEach(assessmentVitalDTO -> {
                    AssessmentVital assessmentVital = assessmentVitalRepository.save(assessmentVitalMapper.assessmentVitalDTOToAssessmentVital(assessmentVitalDTO));
                    finalReqDomain.setAssessmentVitalId(assessmentVital.getId());
                });
            }
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getNursingAssessmentDTO(reqDomain));
        } catch (Exception e) {
            log.error("NursingAssessmentService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(NursingAssessmentDTO reqDomainDTO) {
        log.info("NursingAssessmentService : update() started reqDomain {}", reqDomainDTO);
        try {
            NursingAssessment reqDomain = nursingAssessmentMapper.nursingAssessmentDTOToNursingAssessment(reqDomainDTO);
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = nursingAssessmentRepository.save(reqDomain);

            if (!CollectionUtils.isEmpty(reqDomainDTO.getAssessmentVitalDTOList())) {
                NursingAssessment finalReqDomain = reqDomain;
                reqDomainDTO.getAssessmentVitalDTOList().forEach(assessmentVitalDTO -> {
                    AssessmentVital assessmentVital = assessmentVitalRepository.save(assessmentVitalMapper.assessmentVitalDTOToAssessmentVital(assessmentVitalDTO));
                    finalReqDomain.setAssessmentVitalId(assessmentVital.getId());
                });
            }

            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getNursingAssessmentDTO(reqDomain));
        } catch (Exception e) {
            log.error("NursingAssessmentService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        log.info("NursingAssessmentService : delete() started reqDomain {}", id);
        Optional<NursingAssessment> clinicalAssessmentOptional = nursingAssessmentRepository.findById(id);
        if (clinicalAssessmentOptional.isPresent()) {
            nursingAssessmentRepository.delete(clinicalAssessmentOptional.get());
            return new MasterManagerResponse(MasterConstant.SUCCESS);
        } else {
            return new MasterManagerResponse(MasterConstant.NOT_FOUND);
        }
    }

    private NursingAssessmentDTO getNursingAssessmentDTO(NursingAssessment nursingAssessment) {
        NursingAssessmentDTO nursingAssessmentDTO = nursingAssessmentMapper.nursingAssessmentToNursingAssessmentDTO(nursingAssessment);

        if (Objects.nonNull(nursingAssessmentDTO) && Objects.nonNull(nursingAssessmentDTO.getAppointmentId())) {

            List<AssessmentVital> assessmentVitalList = assessmentVitalRepository.findByAppointmentIdOrderByCreatedDateDesc(nursingAssessmentDTO.getAppointmentId());
            List<AssessmentVitalDTO> assessmentVitalDTOList = new ArrayList<>();
            assessmentVitalList.forEach(assessmentVital ->
                    assessmentVitalDTOList.add(assessmentVitalMapper.assessmentVitalToAssessmentVitalDTO(assessmentVital)));
            if (Objects.nonNull(nursingAssessment.getPatientId())) {
                Optional<Patient> patientOptional = patientRepository.findByPatientId(nursingAssessment.getPatientId());
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
            if (Objects.nonNull(nursingAssessment.getAppointmentId())) {
                Optional<Appointment> appointmentOptional = appointmentRepository.findById(nursingAssessment.getAppointmentId());
                if (appointmentOptional.isPresent()) {
                    Appointment appointment = appointmentOptional.get();
                    nursingAssessmentDTO.setAppointmentNumber(appointment.getDocumentNumber());
                }
            }
            nursingAssessmentDTO.setAssessmentVitalDTOList(assessmentVitalDTOList);
        }
        return nursingAssessmentDTO;
    }
}