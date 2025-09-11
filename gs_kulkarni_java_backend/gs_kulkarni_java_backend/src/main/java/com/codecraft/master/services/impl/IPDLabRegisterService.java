package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.AppointmentServicesMapper;
import com.codecraft.master.models.*;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.AppointmentServiceSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class IPDLabRegisterService {

    @Autowired
    AppointmentServicesService appointmentServicesService;

    @Autowired
    AppointmentServiceRepository appointmentServiceRepository;

    @Autowired
    AppointmentServicesMapper appointmentServicesMapper;

    @Autowired
    ServicesRepository servicesRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    LabRegistrationService registrationService;

    @Autowired
    HospitalRepository hospitalRepository;

    @Autowired
    PathologyTestsRepository pathologyTestsRepository;

    @Autowired
    PaymentService paymentService;

    @Autowired
    PackageMasterRepository packageMasterRepository;
    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    OrganisationRepository organisationRepository;

    @Autowired
    DocumentNumberRepository documentNumberRepository;

    @Autowired
    ServiceHelper serviceHelper;

    public MasterManagerResponse search(AppointmentServiceEntity reqDomain) {
        log.info("AppointmentServicesService : search() started reqDomain {}", reqDomain);
        try {

            Specification<AppointmentServiceEntity> spec = Specification.where(AppointmentServiceSpecification.withIsActive(1));
            if(Objects.nonNull(reqDomain.getAppointmentId())) {
                spec = spec.and(Specification.where(AppointmentServiceSpecification.withAppointmentId(reqDomain.getAppointmentId())));
            }
            if(Objects.nonNull(reqDomain.getType())) {
                spec = spec.and(Specification.where(AppointmentServiceSpecification.withType(reqDomain.getType()).or(AppointmentServiceSpecification.withPackageType(reqDomain.getType()))));
            }
            List<ServiceData>  serviceDataList = servicesRepository.getAll(UserContext.getHospitalId());

            List< AppointmentServiceDTO > appointmentServiceDTOList = new ArrayList<>();
            List<AppointmentServiceEntity> appointmentServiceEntities = appointmentServiceRepository.findAll(spec);

            appointmentServiceEntities.forEach(appointmentServiceEntity -> {
                AppointmentServiceDTO appointmentServiceDTO = getAppointmentServiceDTO(appointmentServiceEntity, serviceDataList);
                appointmentServiceDTOList.add(appointmentServiceDTO);
            });

            return new MasterManagerResponse(MasterConstant.SUCCESS, appointmentServiceDTOList);
        } catch (Exception e) {
            log.error("AppointmentServicesService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private AppointmentServiceDTO getAppointmentServiceDTO(AppointmentServiceEntity appointmentServiceEntity, List<ServiceData> serviceDataList) {
        AppointmentServiceDTO appointmentServiceDTO = appointmentServicesMapper.appointmentServicesToAppointmentServiceDTO(appointmentServiceEntity);
        Optional<ServiceData> serviceDataOptional = serviceDataList.stream().filter(serviceData -> serviceData.getType().equalsIgnoreCase(appointmentServiceEntity.getType()) && serviceData.getId().equals(appointmentServiceEntity.getServiceId())).findFirst();

        serviceDataOptional.ifPresent(serviceData -> appointmentServiceDTO.setServiceName(serviceData.getName()));

        Optional<Payment> paymentOptional = paymentRepository.findByAppointmentAndDocumentNumber(new Appointment(appointmentServiceEntity.getAppointmentId()), appointmentServiceEntity.getPaymentNumber());
        paymentOptional.ifPresent(payment -> appointmentServiceDTO.setPaymentStatus(payment.getPaymentStatus()));
        return appointmentServiceDTO;
    }

    @Transactional
    public MasterManagerResponse save(IPDLabRegister reqDomain) {
        log.info("AppointmentServicesService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.getAppointmentServices().forEach(service -> appointmentServicesService.save(service));

            Optional<Hospital> hospitalOptional = hospitalRepository.findById(UserContext.getHospitalId());
            if (hospitalOptional.isPresent()) {
                Hospital hospital = hospitalOptional.get();
                List<String> hospitalServices = new ArrayList<>();
                if("Y".equalsIgnoreCase(hospital.getLabServices())){
                    hospitalServices.add("T");
                }
                if("Y".equalsIgnoreCase(hospital.getXrayServices())){
                    hospitalServices.add("X");
                }
                 if("Y".equalsIgnoreCase(hospital.getSonoServices())){
                    hospitalServices.add("Q");
                }
                AtomicReference<String> paymentDescription= new AtomicReference<>("");
                AtomicReference<Double> paymentAmount= new AtomicReference<>(0.0);


                hospitalServices.forEach(labType -> {
                    List<AppointmentServiceEntity> appointmentServiceEntityList = appointmentServiceRepository.findByTypeAndAppointmentIdAndLabNoGenerated(labType, reqDomain.getAppointmentId(), "N");
                    if (!CollectionUtils.isEmpty(appointmentServiceEntityList)) {

                        LabRegistrationDTO registration = new LabRegistrationDTO();
                        registration.setStatus("Pending For Sample");
                        registration.setPatientId(reqDomain.getPatientId());
                        registration.setAppointmentId(reqDomain.getAppointmentId());
                        registration.setType(labType);
                        registration.setRegistrationDate(new Date());
                        registration.setLabNumber(getLabNumber());
                        List<LabTestHeaderDTO> labTestHeaderList = new ArrayList<>();


                        appointmentServiceEntityList.forEach(appointmentServiceEntity -> {
                            paymentAmount.set(paymentAmount.get() + appointmentServiceEntity.getCharges());
                            LabTestHeaderDTO labTestHeaderDTO = new LabTestHeaderDTO();
                            labTestHeaderDTO.setServiceId(appointmentServiceEntity.getServiceId());

                            if (appointmentServiceEntity.getCharges() != 0) {
                                Optional<PathologyTests> pathologyTestsOptional = pathologyTestsRepository.findById(appointmentServiceEntity.getServiceId());
                                if (pathologyTestsOptional.isPresent()) {
                                    if (Objects.isNull(paymentDescription.get()) || paymentDescription.get().isEmpty()) {
                                        paymentDescription.set(pathologyTestsOptional.get().getName());
                                    } else {
                                        paymentDescription.set(paymentDescription.get() + ", " + pathologyTestsOptional.get().getName());
                                    }
                                }
                            }
                            labTestHeaderList.add(labTestHeaderDTO);
                            appointmentServiceEntity.setLabNumber(registration.getLabNumber());
                            appointmentServiceEntity.setLabNoGenerated("Y");
                            appointmentServiceRepository.save(appointmentServiceEntity);
                        });
                        registration.setLabTestHeaderList(labTestHeaderList);
                        registrationService.saveWithPayment(registration);
                    }
                });

                List<AppointmentServiceEntity> appointmentServiceEntityList = appointmentServiceRepository.findByTypeAndAppointmentIdAndLabNoGenerated("P", reqDomain.getAppointmentId(), "N");
                appointmentServiceEntityList.forEach(appointmentServiceEntity -> {

                    Optional<PackageMaster> packageMasterOptional = packageMasterRepository.findById(appointmentServiceEntity.getServiceId());

                    if(packageMasterOptional.isPresent()) {
                        PackageMaster pm = packageMasterOptional.get();

                        if (Objects.isNull(paymentDescription.get()) || paymentDescription.get().isEmpty()) {
                            paymentDescription.set(pm.getName());
                        } else {
                            paymentDescription.set(paymentDescription.get() + ", " + pm.getName());
                        }
                        paymentAmount.set(paymentAmount.get() + appointmentServiceEntity.getCharges());

                        appointmentServiceEntity.setLabNoGenerated("Y");
                        appointmentServiceRepository.save(appointmentServiceEntity);
                    }
                });


                if (paymentAmount.get() != 0) {
                    PaymentDTO dto = new PaymentDTO();
                    dto.setDescription(paymentDescription.get());
                    dto.setPaymentStatus("UNPAID");
                    dto.setAppointmentId(reqDomain.getAppointmentId());
                    dto.setPaymentDate(new Date());

                    if (Objects.nonNull(reqDomain.getAppointmentId())) {
                        Optional<Appointment> appointmentOptional = appointmentRepository.findById(reqDomain.getAppointmentId());

                        if (appointmentOptional.isPresent()) {
                            Appointment appointment = appointmentOptional.get();
                            if (Objects.nonNull(appointment.getOrganizationId())) {
                                Optional<Organisation> organisationOptional = organisationRepository.findById(appointment.getOrganizationId());
                                if (organisationOptional.isPresent() && Objects.nonNull(organisationOptional.get().getRatePercentage()) && organisationOptional.get().getRatePercentage() > 0.0) {
                                    Double totalAmount = paymentAmount.get() * organisationOptional.get().getRatePercentage() / 100;
                                    paymentAmount.set(totalAmount);
                                }
                            }
                        }
                    }
                    dto.setAmount(paymentAmount.get());
                    paymentService.save(dto);
                }
            }
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
        } catch (Exception e) {
            log.error("AppointmentServicesService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    private String getLabNumber() {
        Calendar calendar = Calendar.getInstance();
        String hospitalCode = serviceHelper.getHospitalCodeByHospitalId(UserContext.getHospitalId());
        String documentNumber;
        Optional<DocumentNumber> documentNumberOptional = documentNumberRepository.findByDocTypeAndSubDocTypeAndYearAndHospitalId("LAB",hospitalCode, String.valueOf(calendar.get(Calendar.YEAR)), UserContext.getHospitalId());
        if (documentNumberOptional.isPresent()) {
            DocumentNumber d = documentNumberOptional.get();
            documentNumber = d.getDocType() + "/" + d.getSubDocType() + "/" + d.getYear() + "/" + String.format("%07d", d.getDocumentNumber() + 1);
            d.setDocumentNumber(d.getDocumentNumber() + 1);
            documentNumberRepository.save(d);
        } else {
            DocumentNumber d = new DocumentNumber();
            d.setDocType("LAB");
            d.setSubDocType(hospitalCode);
            d.setYear(String.valueOf(calendar.get(Calendar.YEAR)));
            d.setHospitalId(UserContext.getHospitalId());
            d.setDocumentNumber(1);
            d.setActiveInd(1);
            documentNumberRepository.save(d);

            documentNumber = d.getDocType() + "/" + d.getSubDocType() + "/" + calendar.get(Calendar.YEAR) + "/0000001";
        }
        return documentNumber;
    }

}
