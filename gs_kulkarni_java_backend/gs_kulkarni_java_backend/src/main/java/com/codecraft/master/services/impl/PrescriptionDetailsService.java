package com.codecraft.master.services.impl;


import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Employee;
import com.codecraft.master.entities.PrescriptionDetails;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.PrescriptionDetailsMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PrescriptionDetailsDTO;
import com.codecraft.master.models.PrescriptionDetailsSearchRequest;
import com.codecraft.master.repositories.EmployeeRepository;
import com.codecraft.master.repositories.PrescriptionDetailsRepository;
import com.codecraft.master.specifications.AppointmentSpecification;
import com.codecraft.master.specifications.PrescriptionDetailsSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import java.util.*;


@Service
@Slf4j
public class PrescriptionDetailsService {

    @Autowired
    PrescriptionDetailsRepository prescriptionDetailsRepository;

    @Autowired
    PrescriptionDetailsMapper prescriptionDetailsMapper;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    ServiceHelper serviceHelper;

    public MasterManagerResponse search(PrescriptionDetailsSearchRequest reqDomain) {
        log.info("PrescriptionDetailsService : search() started reqDomain {}", reqDomain);
        try {
            Specification<PrescriptionDetails> spec = Specification.where(PrescriptionDetailsSpecification.withHospitalId(UserContext.getHospitalId()));
            spec = spec.and(Specification.where(PrescriptionDetailsSpecification.withIsActive(1)));
            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                spec = spec.and(Specification.where(PrescriptionDetailsSpecification.withAppointmentId(reqDomain.getAppointmentId())));
            }

            if (Objects.nonNull(reqDomain.getPrescriptionDate())) {
                spec = spec.and(Specification.where(PrescriptionDetailsSpecification.withPrescriptionDate(reqDomain.getPrescriptionDate())));
            }

            if (Objects.nonNull(reqDomain.getDoctorId())) {
                spec = spec.and(Specification.where(PrescriptionDetailsSpecification.withDoctorId(reqDomain.getDoctorId())));
            }

            List<PrescriptionDetails> prescriptionDetailsList;
            if(Objects.nonNull(reqDomain.getSortDateBy())) {
                if("ASC".equals(reqDomain.getSortDateBy())){
                    prescriptionDetailsList = prescriptionDetailsRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "prescriptionDate"));
                }else {
                    prescriptionDetailsList = prescriptionDetailsRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "prescriptionDate"));
                }
            }else{
                prescriptionDetailsList = prescriptionDetailsRepository.findAll(spec);
            }

            List<PrescriptionDetailsDTO> prescriptionDetailsDTOList  = new ArrayList<>();
                    prescriptionDetailsList.forEach(prescriptionDetails -> {
                PrescriptionDetailsDTO dto =  prescriptionDetailsMapper.prescriptionDetailsToPrescriptionDetailsDTO(prescriptionDetails);

                if(Objects.nonNull(dto.getDoctorId())){
                        Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(dto.getDoctorId());
                        employeeOptional.ifPresent(employee -> dto.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
                }
                        dto.setCreatedBy(serviceHelper.getNameByEmployeeEmailId(prescriptionDetails.getCreatedBy()));
                prescriptionDetailsDTOList.add(dto);
            });

            return new MasterManagerResponse(MasterConstant.SUCCESS, prescriptionDetailsDTOList);
        } catch (Exception e) {
            log.error("PrescriptionDetailsService : search() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(PrescriptionDetails reqDomain) {
        log.info("PrescriptionDetailsService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getPrescriptionDate())){
                reqDomain.setPrescriptionDate(new Date());
            }
            PrescriptionDetails prescriptionDetails = prescriptionDetailsRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, prescriptionDetails);
        } catch (Exception e) {
            log.error("PrescriptionDetailsService : save() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse saveAll(List<PrescriptionDetails> reqDomains) {
        log.info("PrescriptionDetailsService : saveAll() started reqDomain {}", reqDomains);
        try {
            Date prescriptionDate = new Date();
            reqDomains.forEach(reqDomain -> {
                        reqDomain.setActiveInd(1);
                        reqDomain.setHospitalId(UserContext.getHospitalId());
                        if (Objects.isNull(reqDomain.getPrescriptionDate())) {
                            reqDomain.setPrescriptionDate(prescriptionDate);
                        }
                    });
            List<PrescriptionDetails> prescriptionDetails = prescriptionDetailsRepository.saveAll(reqDomains);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, prescriptionDetails);
        } catch (Exception e) {
            log.error("PrescriptionDetailsService : save() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Transactional
    public MasterManagerResponse update(PrescriptionDetails reqDomain) {
        log.info("PrescriptionDetailsService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getPrescriptionDate())){
                reqDomain.setPrescriptionDate(new Date());
            }
            PrescriptionDetails prescriptionDetails = prescriptionDetailsRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, prescriptionDetails);
        } catch (Exception e) {
            log.error("PrescriptionDetailsService : update() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
       Optional<PrescriptionDetails> toDeleteOptional = prescriptionDetailsRepository.findById(id);
       if(toDeleteOptional.isPresent()){
           PrescriptionDetails prescriptionDetails = toDeleteOptional.get();
           prescriptionDetails.setActiveInd(0);
           prescriptionDetailsRepository.save(prescriptionDetails);
       }
        return new MasterManagerResponse(MasterConstant.SUCCESS);
    }
}
