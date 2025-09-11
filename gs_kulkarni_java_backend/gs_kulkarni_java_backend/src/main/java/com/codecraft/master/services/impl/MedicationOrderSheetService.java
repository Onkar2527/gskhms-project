package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.MedicationOrderSheet;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.MedicationOrderSheetMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.MedicationOrderSheetDTO;
import com.codecraft.master.repositories.AppointmentRepository;
import com.codecraft.master.repositories.AssessmentVitalRepository;
import com.codecraft.master.repositories.MedicationOrderSheetRepository;
import com.codecraft.master.repositories.PatientRepository;
import com.codecraft.master.specifications.MedicationOrderSheetSpecification;
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
public class MedicationOrderSheetService {

    @Autowired
    MedicationOrderSheetRepository medicationOrderSheetRepository;

    @Autowired
    MedicationOrderSheetMapper medicationOrderSheetMapper;

    @Autowired
    AssessmentVitalRepository assessmentVitalRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    public MasterManagerResponse search(MedicationOrderSheetDTO reqDomain) {
        log.info("NursingAssessmentService : search() started reqDomain {}", reqDomain);
        try {
            Specification<MedicationOrderSheet> spec = Specification.where(MedicationOrderSheetSpecification.withHospitalId(UserContext.getHospitalId()));
            spec = spec.and(Specification.where(MedicationOrderSheetSpecification.withIsActive(1)));

            if (Objects.nonNull(reqDomain.getId())) {
                spec = spec.and(Specification.where(MedicationOrderSheetSpecification.withId(reqDomain.getId())));
            }

            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                spec = spec.and(Specification.where(MedicationOrderSheetSpecification.withAppointmentId(reqDomain.getAppointmentId())));
            }

            if (Objects.nonNull(reqDomain.getPatientId())) {
                spec = spec.and(Specification.where(MedicationOrderSheetSpecification.withPatientId(reqDomain.getPatientId())));
            }

            List<MedicationOrderSheet> clinicalAssessmentList = medicationOrderSheetRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "medicationDate"));
            List<MedicationOrderSheetDTO> nursingAssessmentDTOList = new ArrayList<>();
            clinicalAssessmentList.forEach(clinicalAssessment ->
                    nursingAssessmentDTOList.add(getMedicationOrderSheetDTO(clinicalAssessment)));

            return new MasterManagerResponse(MasterConstant.SUCCESS, nursingAssessmentDTOList);
        } catch (Exception e) {
            log.error("NursingAssessmentService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(MedicationOrderSheetDTO reqDomainDTO) {
        log.info("NursingAssessmentService : save() started reqDomain {}", reqDomainDTO);
        try {
            MedicationOrderSheet reqDomain = medicationOrderSheetMapper.medicationOrderSheetDTOToMedicationOrderSheet(reqDomainDTO);
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = medicationOrderSheetRepository.save(reqDomain);

            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getMedicationOrderSheetDTO(reqDomain));
        } catch (Exception e) {
            log.error("NursingAssessmentService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(MedicationOrderSheetDTO reqDomainDTO) {
        log.info("NursingAssessmentService : update() started reqDomain {}", reqDomainDTO);
        try {
            MedicationOrderSheet reqDomain = medicationOrderSheetMapper.medicationOrderSheetDTOToMedicationOrderSheet(reqDomainDTO);
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = medicationOrderSheetRepository.save(reqDomain);


            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getMedicationOrderSheetDTO(reqDomain));
        } catch (Exception e) {
            log.error("NursingAssessmentService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        log.info("NursingAssessmentService : delete() started reqDomain {}", id);
        Optional<MedicationOrderSheet> clinicalAssessmentOptional = medicationOrderSheetRepository.findById(id);
        if (clinicalAssessmentOptional.isPresent()) {
            medicationOrderSheetRepository.delete(clinicalAssessmentOptional.get());
            return new MasterManagerResponse(MasterConstant.SUCCESS);
        } else {
            return new MasterManagerResponse(MasterConstant.NOT_FOUND);
        }
    }

    private MedicationOrderSheetDTO getMedicationOrderSheetDTO(MedicationOrderSheet nursingAssessment) {
        MedicationOrderSheetDTO nursingAssessmentDTO = medicationOrderSheetMapper.medicationOrderSheetToMedicationOrderSheetDTO(nursingAssessment);

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