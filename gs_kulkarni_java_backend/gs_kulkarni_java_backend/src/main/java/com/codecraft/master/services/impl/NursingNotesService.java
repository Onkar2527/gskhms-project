package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.NursingNotes;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.NursingNotesMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.NursingNotesDTO;
import com.codecraft.master.repositories.AppointmentRepository;
import com.codecraft.master.repositories.AssessmentVitalRepository;
import com.codecraft.master.repositories.NursingNotesRepository;
import com.codecraft.master.repositories.PatientRepository;
import com.codecraft.master.specifications.NursingNotesSpecification;
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
public class NursingNotesService {

    @Autowired
    NursingNotesRepository nursingNotesRepository;

    @Autowired
    NursingNotesMapper nursingNotesMapper;

    @Autowired
    AssessmentVitalRepository assessmentVitalRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    public MasterManagerResponse search(NursingNotesDTO reqDomain) {
        log.info("NursingAssessmentService : search() started reqDomain {}", reqDomain);
        try {
            Specification<NursingNotes> spec = Specification.where(NursingNotesSpecification.withHospitalId(UserContext.getHospitalId()));
            spec = spec.and(Specification.where(NursingNotesSpecification.withIsActive(1)));

            if (Objects.nonNull(reqDomain.getId())) {
                spec = spec.and(Specification.where(NursingNotesSpecification.withId(reqDomain.getId())));
            }

            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                spec = spec.and(Specification.where(NursingNotesSpecification.withAppointmentId(reqDomain.getAppointmentId())));
            }

            if (Objects.nonNull(reqDomain.getPatientId())) {
                spec = spec.and(Specification.where(NursingNotesSpecification.withPatientId(reqDomain.getPatientId())));
            }

            List<NursingNotes> clinicalAssessmentList = nursingNotesRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "notesDate"));
            List<NursingNotesDTO> nursingAssessmentDTOList = new ArrayList<>();
            clinicalAssessmentList.forEach(clinicalAssessment ->
                    nursingAssessmentDTOList.add(getNursingNotesDTO(clinicalAssessment)));

            return new MasterManagerResponse(MasterConstant.SUCCESS, nursingAssessmentDTOList);
        } catch (Exception e) {
            log.error("NursingAssessmentService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(NursingNotesDTO reqDomainDTO) {
        log.info("NursingAssessmentService : save() started reqDomain {}", reqDomainDTO);
        try {
            NursingNotes reqDomain = nursingNotesMapper.nursingNotesDTOToNursingNotes(reqDomainDTO);
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = nursingNotesRepository.save(reqDomain);

            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getNursingNotesDTO(reqDomain));
        } catch (Exception e) {
            log.error("NursingAssessmentService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(NursingNotesDTO reqDomainDTO) {
        log.info("NursingAssessmentService : update() started reqDomain {}", reqDomainDTO);
        try {
            NursingNotes reqDomain = nursingNotesMapper.nursingNotesDTOToNursingNotes(reqDomainDTO);
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = nursingNotesRepository.save(reqDomain);


            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getNursingNotesDTO(reqDomain));
        } catch (Exception e) {
            log.error("NursingAssessmentService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        log.info("NursingAssessmentService : delete() started reqDomain {}", id);
        Optional<NursingNotes> clinicalAssessmentOptional = nursingNotesRepository.findById(id);
        if (clinicalAssessmentOptional.isPresent()) {
            nursingNotesRepository.delete(clinicalAssessmentOptional.get());
            return new MasterManagerResponse(MasterConstant.SUCCESS);
        } else {
            return new MasterManagerResponse(MasterConstant.NOT_FOUND);
        }
    }

    private NursingNotesDTO getNursingNotesDTO(NursingNotes nursingAssessment) {
        NursingNotesDTO nursingAssessmentDTO = nursingNotesMapper.nursingNotesToNursingNotesDTO(nursingAssessment);

        if (Objects.nonNull(nursingAssessmentDTO) && Objects.nonNull(nursingAssessmentDTO.getAppointmentId())) {

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
        }
        return nursingAssessmentDTO;
    }
}