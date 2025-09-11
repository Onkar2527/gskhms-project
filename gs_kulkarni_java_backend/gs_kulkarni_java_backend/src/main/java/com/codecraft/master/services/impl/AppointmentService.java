package com.codecraft.master.services.impl;


import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.mappers.AppointmentMapper;
import com.codecraft.master.models.AppointmentDTO;
import com.codecraft.master.models.AppointmentSearchRequest;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.AppointmentSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;


@Service
@Slf4j
public class AppointmentService {

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    AppointmentMapper appointmentMapper;

    @Autowired
    HospitalRepository hospitalRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    DocumentNumberRepository documentNumberRepository;

    @Autowired
    AppointmentServiceRepository appointmentServiceRepository;

    @Autowired
    AppointmentBedAssignService appointmentBedAssignService;

    @Autowired
    BedRepository bedRepository;  //A - Available. B-Booked, R- Reserved

    @Autowired
    ServicesRepository servicesRepository;
    @Autowired
    ServiceHelper serviceHelper;

    public MasterManagerResponse search(AppointmentSearchRequest reqDomain) {
        log.info("AppointmentService : search() started reqDomain {}", reqDomain);
        Specification<Appointment> spec = Specification.where(AppointmentSpecification.withHospitalId(UserContext.getHospitalId()));
        spec = spec.and(Specification.where(AppointmentSpecification.withIsActive(1)));

        if(Objects.nonNull(reqDomain.getId())){
            spec = spec.and(Specification.where(AppointmentSpecification.withId(reqDomain.getId())));
        }
        if (Objects.nonNull(reqDomain.getType())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withType(reqDomain.getType())));
        }
        if (Objects.nonNull(reqDomain.getDoctorId())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withPrimaryDoctorId(reqDomain.getDoctorId())));
        }

        if (!CollectionUtils.isEmpty(reqDomain.getStatuses())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withStatusIn(reqDomain.getStatuses())));
        }
        if (Objects.nonNull(reqDomain.getAppointmentDate())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withAppointmentDate(reqDomain.getAppointmentDate())));
        }
        if (Objects.nonNull(reqDomain.getPatientId())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withPatientId(reqDomain.getPatientId())));
        }
        if (Objects.nonNull(reqDomain.getDischargeStatus())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withDischargeStatus(reqDomain.getDischargeStatus())));
        }
        if (Objects.nonNull(reqDomain.getFirstName())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withFirstName(reqDomain.getFirstName())));
        }
        if (Objects.nonNull(reqDomain.getLastName())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withLastName(reqDomain.getLastName())));
        }
        if (Objects.nonNull(reqDomain.getMobileNumber())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withMobileNumber(reqDomain.getMobileNumber())));
        }
        if (Objects.nonNull(reqDomain.getOperationRecommended())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withOperationRecommended(reqDomain.getOperationRecommended())));
        }
        if (Objects.nonNull(reqDomain.getAdmissionRecommended())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withAdmissionRecommended(reqDomain.getAdmissionRecommended())));
        }
        if (Objects.nonNull(reqDomain.getIsEmergency())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withIsEmergency(reqDomain.getIsEmergency())));
        }
        if (Objects.nonNull(reqDomain.getAppointmentStartDate()) && Objects.nonNull(reqDomain.getAppointmentEndDate())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withAppointmentDateBetween(reqDomain.getAppointmentStartDate(), reqDomain.getAppointmentEndDate())));
        }

        List<Appointment> appointmentList = appointmentRepository.findAll(spec);

        List<AppointmentDTO> appointmentDTOList = new ArrayList<>();
        appointmentList.forEach(appointment -> {
            AppointmentDTO response = appointmentMapper.appointmentToAppointmentDTO(appointment);

            if (Objects.nonNull(appointment.getPatientId())) {
                Optional<Patient> patientOptional = patientRepository.findByPatientId(appointment.getPatientId());
                patientOptional.ifPresent(patient -> response.setPatientUHIDNumber(patient.getDocumentNumber()));
            }
            if (Objects.nonNull(appointment.getDoctorId())) {
                Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getDoctorId());
                employeeOptional.ifPresent(employee -> response.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
            }
            if (Objects.nonNull(appointment.getSecDoctorId())) {
                Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getSecDoctorId());
                employeeOptional.ifPresent(employee -> response.setSecDoctorName(employee.getFirstName() + " " + employee.getLastName()));
            }
            response.setCreatedBy(serviceHelper.getNameByEmployeeEmailId(appointment.getCreatedBy()));
            appointmentDTOList.add(response);
        });


        return new MasterManagerResponse(MasterConstant.SUCCESS, appointmentDTOList);
    }

    public MasterManagerResponse searchPast(AppointmentSearchRequest reqDomain) {
        log.info("AppointmentService : search() started reqDomain {}", reqDomain);
        Specification<Appointment> spec = Specification.where(AppointmentSpecification.withHospitalId(UserContext.getHospitalId()));
        spec = spec.and(Specification.where(AppointmentSpecification.withIsActive(1)));

        if (Objects.nonNull(reqDomain.getType())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withType(reqDomain.getType())));
        }
        if (Objects.nonNull(reqDomain.getDoctorId())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withPrimaryDoctorId(reqDomain.getDoctorId())));
        }

        if (!CollectionUtils.isEmpty(reqDomain.getStatuses())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withStatusIn(reqDomain.getStatuses())));
        }
        if (Objects.nonNull(reqDomain.getAppointmentDate())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withAppointmentDateLessThan(reqDomain.getAppointmentDate())));
        }
        if (Objects.nonNull(reqDomain.getPatientId())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withPatientId(reqDomain.getPatientId())));
        }
        List<Appointment> appointmentList = appointmentRepository.findAll(spec);

        List<AppointmentDTO> appointmentDTOList = new ArrayList<>();
        appointmentList.forEach(appointment -> {
            AppointmentDTO response = appointmentMapper.appointmentToAppointmentDTO(appointment);

            if (Objects.nonNull(appointment.getPatientId())) {
                Optional<Patient> patientOptional = patientRepository.findByPatientId(appointment.getPatientId());
                patientOptional.ifPresent(patient -> response.setPatientUHIDNumber(patient.getDocumentNumber()));
            }
            if (Objects.nonNull(appointment.getDoctorId())) {
                Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getDoctorId());
                employeeOptional.ifPresent(employee -> response.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
            }
            if (Objects.nonNull(appointment.getSecDoctorId())) {
                Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getSecDoctorId());
                employeeOptional.ifPresent(employee -> response.setSecDoctorName(employee.getFirstName() + " " + employee.getLastName()));
            }

            appointmentDTOList.add(response);
        });

        return new MasterManagerResponse(MasterConstant.SUCCESS, appointmentDTOList);
    }

    public MasterManagerResponse searchFuture(AppointmentSearchRequest reqDomain) {
        log.info("AppointmentService : search() started reqDomain {}", reqDomain);
        Specification<Appointment> spec = Specification.where(AppointmentSpecification.withHospitalId(UserContext.getHospitalId()));
        spec = spec.and(Specification.where(AppointmentSpecification.withIsActive(1)));

        if (Objects.nonNull(reqDomain.getType())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withType(reqDomain.getType())));
        }
        if (Objects.nonNull(reqDomain.getDoctorId())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withPrimaryDoctorId(reqDomain.getDoctorId())));
        }

        if (!CollectionUtils.isEmpty(reqDomain.getStatuses())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withStatusIn(reqDomain.getStatuses())));
        }
        if (Objects.nonNull(reqDomain.getAppointmentDate())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withAppointmentDateGreaterThan(reqDomain.getAppointmentDate())));
        }
        if (Objects.nonNull(reqDomain.getPatientId())) {
            spec = spec.and(Specification.where(AppointmentSpecification.withPatientId(reqDomain.getPatientId())));
        }

        List<Appointment> appointmentList = appointmentRepository.findAll(spec);


        List<AppointmentDTO> appointmentDTOList = new ArrayList<>();
        appointmentList.forEach(appointment -> {
            AppointmentDTO response = appointmentMapper.appointmentToAppointmentDTO(appointment);

            if (Objects.nonNull(appointment.getPatientId())) {
                Optional<Patient> patientOptional = patientRepository.findByPatientId(appointment.getPatientId());
                patientOptional.ifPresent(patient -> response.setPatientUHIDNumber(patient.getDocumentNumber()));
            }
            if (Objects.nonNull(appointment.getDoctorId())) {
                Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getDoctorId());
                employeeOptional.ifPresent(employee -> response.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
            }
            if (Objects.nonNull(appointment.getSecDoctorId())) {
                Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getSecDoctorId());
                employeeOptional.ifPresent(employee -> response.setSecDoctorName(employee.getFirstName() + " " + employee.getLastName()));
            }

            appointmentDTOList.add(response);
        });
        return new MasterManagerResponse(MasterConstant.SUCCESS, appointmentDTOList);
    }

    @Transactional
    public MasterManagerResponse save(AppointmentDTO reqDomainDTO) {
        Appointment reqDomain = appointmentMapper.appointmentDTOToAppointment(reqDomainDTO);
        reqDomain.setHospitalId(UserContext.getHospitalId());
        reqDomain.setActiveInd(1);
        Calendar calendar = Calendar.getInstance();
        String hospitalCode = hospitalRepository.findById(UserContext.getHospitalId()).get().getHospitalCode();
        Optional<DocumentNumber> documentNumberOptional = documentNumberRepository.findByDocTypeAndSubDocTypeAndYearAndHospitalId(reqDomainDTO.getDocType(), hospitalCode, String.valueOf(calendar.get(Calendar.YEAR)), UserContext.getHospitalId());


        //DocTYpe - OPD/IPD
        //SubDocType: Hospital code
        //
        String documentNumber;
        if (documentNumberOptional.isPresent()) {
            DocumentNumber d = documentNumberOptional.get();
            documentNumber = d.getDocType() + "/" + d.getSubDocType() + "/" + d.getYear() + "/" + String.format("%06d", d.getDocumentNumber() + 1);
            d.setDocumentNumber(d.getDocumentNumber() + 1);
            documentNumberRepository.save(d);
        } else {
            documentNumber = reqDomainDTO.getDocType() + "/" + reqDomainDTO.getSubDocType() + "/" + calendar.get(Calendar.YEAR) + "/000001";
            DocumentNumber d = new DocumentNumber();
            d.setDocType(reqDomainDTO.getDocType());
            d.setSubDocType(hospitalCode);
            d.setYear(String.valueOf(calendar.get(Calendar.YEAR)));
            d.setHospitalId(UserContext.getHospitalId());
            d.setDocumentNumber(1);
            d.setActiveInd(1);
            documentNumberRepository.save(d);
        }
        if(Objects.isNull(reqDomain.getAppointmentDate())) {
            reqDomain.setAppointmentDate(new Date());
        }
        reqDomain.setDocumentNumber(documentNumber);
        Optional<Patient> patientOptional = patientRepository.findByHospitalIdAndMobileNumberAndFirstNameAndLastName(UserContext.getHospitalId(), reqDomain.getMobileNumber(), reqDomain.getFirstName(), reqDomain.getLastName());
        Patient newPatient;
        if (patientOptional.isPresent()) {
            newPatient = patientOptional.get();
            reqDomain.setPatientId(patientOptional.get().getPatientId());
        } else {
            //create patient and set patient id
            newPatient = appointmentMapper.appointmentToPatient(reqDomain);
            newPatient.setDocumentNumber(serviceHelper.randomDigitsUHID());
            newPatient = patientRepository.save(newPatient);
            reqDomain.setPatientId(newPatient.getPatientId());
        }

        Appointment appointment = appointmentRepository.save(reqDomain);


        if(Objects.nonNull(reqDomainDTO.getBedId())){
            AppointmentBedAssign appointmentBedAssign = new AppointmentBedAssign();
            appointmentBedAssign.setAppointmentId(appointment.getId());
            appointmentBedAssign.setBedId(reqDomainDTO.getBedId());
            appointmentBedAssign.setStartTime(new Date());
            appointmentBedAssignService.save(appointmentBedAssign);

            Optional<Bed> bed = bedRepository.findById(reqDomainDTO.getBedId());
            if(bed.isPresent()){
                Bed bedEntity = bed.get();
                bedEntity.setStatus("B");
                bedRepository.save(bedEntity);
            }
        }


        AppointmentDTO response = appointmentMapper.appointmentToAppointmentDTO(appointment);
        response.setPatientUHIDNumber(newPatient.getDocumentNumber());

        if (Objects.nonNull(appointment.getDoctorId())) {
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getDoctorId());
            employeeOptional.ifPresent(employee -> response.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
        }
        if (Objects.nonNull(appointment.getSecDoctorId())) {
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getSecDoctorId());
            employeeOptional.ifPresent(employee -> response.setSecDoctorName(employee.getFirstName() + " " + employee.getLastName()));
        }


        return new MasterManagerResponse(MasterConstant.DATA_SAVED, response);
    }

    @Transactional
    public MasterManagerResponse update(AppointmentDTO reqDomainDTO) {
        Appointment reqDomain = appointmentMapper.appointmentDTOToAppointment(reqDomainDTO);

        reqDomain.setHospitalId(UserContext.getHospitalId());
        Optional<Appointment> appointment = appointmentRepository.findById(reqDomain.getId());
        reqDomain.setActiveInd(1);
        Appointment appointmentToSave = null;



        //updated code currentlty
//         Date lastAppointmentDate = appointmentToSave.getAppointmentDate(); 
//         Date newAppointmentDate = reqDomainDTO.getAppointmentDate();

//             if (lastAppointmentDate != null && newAppointmentDate != null) {
//                     long diffInMillies = Math.abs(newAppointmentDate.getTime() - lastAppointmentDate.getTime());
//                     long diffInDays = diffInMillies / (1000 * 60 * 60 * 24);

//                          if (diffInDays <= 60) {
//                               reqDomain.setServiceId(1);
//                              } else {
//                                     reqDomain.setServiceId(2);
//                                  }

//     appointmentToSave.setServiceId(reqDomain.getServiceId());
// }
        


        if (appointment.isPresent()) {
            appointmentToSave = appointment.get();

            if(Objects.nonNull(reqDomainDTO.getBedId())){
               Optional<AppointmentBedAssign> appointmentBedAssignOptional =  appointmentBedAssignService.getByAppointmentAndStatusAssigned(appointmentToSave.getId());

               if(appointmentBedAssignOptional.isPresent()){
                   AppointmentBedAssign exisingAppointmentBedAssign =  appointmentBedAssignOptional.get();
                   if(!Objects.equals(exisingAppointmentBedAssign.getBedId(), reqDomainDTO.getBedId())){

                       AppointmentBedAssign appointmentBedAssign = new AppointmentBedAssign();
                       appointmentBedAssign.setAppointmentId(exisingAppointmentBedAssign.getAppointmentId());
                       appointmentBedAssign.setBedId(reqDomainDTO.getBedId());
                       appointmentBedAssign.setStartTime(new Date());
                       appointmentBedAssign.setActiveInd(1);
                       appointmentBedAssign.setStatus("A"); //Allocate/
                       appointmentBedAssign.setHospitalId(UserContext.getHospitalId());
                       appointmentBedAssign.setId(exisingAppointmentBedAssign.getId());

                       appointmentBedAssignService.update(appointmentBedAssign);
                   }
               }else{
                   AppointmentBedAssign appointmentBedAssign = new AppointmentBedAssign();
                   appointmentBedAssign.setAppointmentId(reqDomainDTO.getId());
                   appointmentBedAssign.setBedId(reqDomainDTO.getBedId());
                   appointmentBedAssign.setStartTime(new Date());
                   appointmentBedAssignService.save(appointmentBedAssign);
                   Optional<Bed> bed = bedRepository.findById(reqDomainDTO.getBedId());
                   if(bed.isPresent()){
                       Bed bedEntity = bed.get();
                       bedEntity.setStatus("B");  //Booked/Available/Reserve/Unassigned
                       bedRepository.save(bedEntity);
                   }
               }

            }


            //Only update updatable fields from response
            if (Objects.nonNull(reqDomain.getSpecialInstruction())) {
                appointmentToSave.setSpecialInstruction(reqDomain.getSpecialInstruction());
            }

            if (Objects.nonNull(reqDomain.getDisease())) {
                appointmentToSave.setDisease(reqDomain.getDisease());
            }

            if (Objects.nonNull(reqDomain.getStatus())) {
                appointmentToSave.setStatus(reqDomain.getStatus());
            }

            if (Objects.nonNull(reqDomain.getMobileNumber())) {
                appointmentToSave.setMobileNumber(reqDomain.getMobileNumber());
            }

            if (Objects.nonNull(reqDomain.getRemark())) {
                appointmentToSave.setRemark(reqDomain.getRemark());
            }

            if (Objects.nonNull(reqDomain.getFirstName())) {
                appointmentToSave.setFirstName(reqDomain.getFirstName());
            }
            if (Objects.nonNull(reqDomain.getLastName())) {
                appointmentToSave.setLastName(reqDomain.getLastName());
            }

            if (Objects.nonNull(reqDomain.getDoctorId())) {
                appointmentToSave.setDoctorId(reqDomain.getDoctorId());
            }

            if (Objects.nonNull(reqDomain.getSecDoctorId())) {
                appointmentToSave.setSecDoctorId(reqDomain.getSecDoctorId());
            }

            if (Objects.nonNull(reqDomain.getPatientId())) {
                appointmentToSave.setPatientId(reqDomain.getPatientId());
            }

            if (Objects.nonNull(reqDomain.getNamePrefix())) {
                appointmentToSave.setNamePrefix(reqDomain.getNamePrefix());
            }

            if (Objects.nonNull(reqDomain.getInstruction())) {
                appointmentToSave.setInstruction(reqDomain.getInstruction());
            }

            if (Objects.nonNull(reqDomain.getOperationRecommended())) {
                appointmentToSave.setOperationRecommended(reqDomain.getOperationRecommended());
            }

            if (Objects.nonNull(reqDomain.getOperationDetails())) {
                appointmentToSave.setOperationDetails(reqDomain.getOperationDetails());
            }

            if (Objects.nonNull(reqDomain.getAdmissionRecommended())) {
                appointmentToSave.setAdmissionRecommended(reqDomain.getAdmissionRecommended());
            }

            if (Objects.nonNull(reqDomain.getAdmissionDetails())) {
                appointmentToSave.setAdmissionDetails(reqDomain.getAdmissionDetails());
            }
            if (Objects.nonNull(reqDomain.getGender())) {
                appointmentToSave.setGender(reqDomain.getGender());
            }

            if (Objects.nonNull(reqDomain.getDischargeStatus())) {
                appointmentToSave.setDischargeStatus(reqDomain.getDischargeStatus());
            }

            if (Objects.nonNull(reqDomain.getDischargeNote())) {
                appointmentToSave.setDischargeNote(reqDomain.getDischargeNote());
            }
            if (Objects.nonNull(reqDomain.getDischargeDate())) {
                appointmentToSave.setDischargeDate(reqDomain.getDischargeDate());
            }
            if (Objects.nonNull(reqDomain.getServiceId())) {
                appointmentToSave.setServiceId(reqDomain.getServiceId());
            }
        

            if (Objects.nonNull(reqDomain.getAddress())) {
                appointmentToSave.setAddress(reqDomain.getAddress());
            }

            if (Objects.nonNull(reqDomain.getPriority())) {
                appointmentToSave.setPriority(reqDomain.getPriority());
            }

            if (Objects.nonNull(reqDomain.getReferredBy())) {
                appointmentToSave.setReferredBy(reqDomain.getReferredBy());
            }



            

          

        }






        Appointment appointmentSaved = appointmentRepository.save(appointmentToSave);
        AppointmentDTO response = appointmentMapper.appointmentToAppointmentDTO(appointmentSaved);
        if (Objects.nonNull(appointmentSaved.getPatientId())) {
            Optional<Patient> patientOptional = patientRepository.findByPatientId(appointmentSaved.getPatientId());
            patientOptional.ifPresent(patient -> response.setPatientUHIDNumber(patient.getDocumentNumber()));
        }
        if (Objects.nonNull(appointmentSaved.getDoctorId())) {
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointmentSaved.getDoctorId());
            employeeOptional.ifPresent(employee -> response.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
        }
        if (Objects.nonNull(appointmentSaved.getSecDoctorId())) {
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointmentSaved.getSecDoctorId());
            employeeOptional.ifPresent(employee -> response.setSecDoctorName(employee.getFirstName() + " " + employee.getLastName()));
        }
        return new MasterManagerResponse(MasterConstant.DATA_MODIFY,response);
    }



}
