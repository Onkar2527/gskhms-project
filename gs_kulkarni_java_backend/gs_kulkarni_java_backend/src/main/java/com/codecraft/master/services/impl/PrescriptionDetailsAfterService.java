package com.codecraft.master.services.impl;


import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Employee;
import com.codecraft.master.entities.PrescriptionDetailsAfter;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.PrescriptionDetailsAfterMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PrescriptionDetailsAfterDTO;
import com.codecraft.master.models.PrescriptionDetailsSearchRequestAfter;
import com.codecraft.master.repositories.EmployeeRepository;
import com.codecraft.master.repositories.PrescriptionDetailsAfterRepository;
import com.codecraft.master.specifications.AppointmentSpecification;
import com.codecraft.master.specifications.PrescriptionDetailsSpecificationAfter;
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
public class PrescriptionDetailsAfterService {

    @Autowired
    PrescriptionDetailsAfterRepository prescriptionDetailsAfterRepository;

    @Autowired
    PrescriptionDetailsAfterMapper prescriptionDetailsAfterMapper;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    ServiceHelper serviceHelper;

    public MasterManagerResponse search(PrescriptionDetailsSearchRequestAfter reqDomain) {
        log.info("PrescriptionDetailsAfterService : search() started reqDomain {}", reqDomain);
        try {
            Specification<PrescriptionDetailsAfter> spec = Specification.where(PrescriptionDetailsSpecificationAfter.withHospitalId(UserContext.getHospitalId()));
            spec = spec.and(Specification.where(PrescriptionDetailsSpecificationAfter.withIsActive(1)));
            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                spec = spec.and(Specification.where(PrescriptionDetailsSpecificationAfter.withAppointmentId(reqDomain.getAppointmentId())));
            }

            if (Objects.nonNull(reqDomain.getPrescriptionDate())) {
                spec = spec.and(Specification.where(PrescriptionDetailsSpecificationAfter.withPrescriptionDate(reqDomain.getPrescriptionDate())));
            }

            if (Objects.nonNull(reqDomain.getDoctorId())) {
                spec = spec.and(Specification.where(PrescriptionDetailsSpecificationAfter.withDoctorId(reqDomain.getDoctorId())));
            }

            List<PrescriptionDetailsAfter> prescriptionDetailsList;
            if(Objects.nonNull(reqDomain.getSortDateBy())) {
                if("ASC".equals(reqDomain.getSortDateBy())){
                    prescriptionDetailsList = prescriptionDetailsAfterRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "prescriptionDate"));
                }else {
                    prescriptionDetailsList = prescriptionDetailsAfterRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "prescriptionDate"));
                }
            }else{
                prescriptionDetailsList = prescriptionDetailsAfterRepository.findAll(spec);
            }

            List<PrescriptionDetailsAfterDTO> prescriptionDetailsDTOList  = new ArrayList<>();
                    prescriptionDetailsList.forEach(prescriptionDetailsAfter -> {
                PrescriptionDetailsAfterDTO dto =  prescriptionDetailsAfterMapper.prescriptionDetailsAfterToPrescriptionDetailsAfterDTO(prescriptionDetailsAfter);

                if(Objects.nonNull(dto.getDoctorId())){
                        Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(dto.getDoctorId());
                        employeeOptional.ifPresent(employee -> dto.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
                }
                        dto.setCreatedBy(serviceHelper.getNameByEmployeeEmailId(prescriptionDetailsAfter.getCreatedBy()));
                prescriptionDetailsDTOList.add(dto);
            });

            return new MasterManagerResponse(MasterConstant.SUCCESS, prescriptionDetailsDTOList);
        } catch (Exception e) {
            log.error("PrescriptionDetailsAfterService : search() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(PrescriptionDetailsAfter reqDomain) {
        log.info("PrescriptionDetailsAfterService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getPrescriptionDate())){
                reqDomain.setPrescriptionDate(new Date());
            }
            PrescriptionDetailsAfter prescriptionDetails = prescriptionDetailsAfterRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, prescriptionDetails);
        } catch (Exception e) {
            log.error("PrescriptionDetailsAfterService : save() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse saveAll(List<PrescriptionDetailsAfter> reqDomains) {
        log.info("PrescriptionDetailsAfterService : saveAll() started reqDomain {}", reqDomains);
        try {
            Date prescriptionDate = new Date();
            reqDomains.forEach(reqDomain -> {
                        reqDomain.setActiveInd(1);
                        reqDomain.setHospitalId(UserContext.getHospitalId());
                        if (Objects.isNull(reqDomain.getPrescriptionDate())) {
                            reqDomain.setPrescriptionDate(prescriptionDate);
                        }
                    });
            List<PrescriptionDetailsAfter> prescriptionDetails = prescriptionDetailsAfterRepository.saveAll(reqDomains);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, prescriptionDetails);
        } catch (Exception e) {
            log.error("PrescriptionDetailsAfterService : save() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Transactional
    public MasterManagerResponse update(PrescriptionDetailsAfter reqDomain) {
        log.info("PrescriptionDetailsAfterService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getPrescriptionDate())){
                reqDomain.setPrescriptionDate(new Date());
            }
            PrescriptionDetailsAfter prescriptionDetails = prescriptionDetailsAfterRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, prescriptionDetails);
        } catch (Exception e) {
            log.error("PrescriptionDetailsAfterService : update() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
       Optional<PrescriptionDetailsAfter> toDeleteOptional = prescriptionDetailsAfterRepository.findById(id);
       if(toDeleteOptional.isPresent()){
           PrescriptionDetailsAfter prescriptionDetails = toDeleteOptional.get();
           prescriptionDetails.setActiveInd(0);
           prescriptionDetailsAfterRepository.save(prescriptionDetails);
       }
        return new MasterManagerResponse(MasterConstant.SUCCESS);
    }
}
    