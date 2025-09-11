package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.AppointmentServiceEntity;
import com.codecraft.master.entities.PackageMasterDetails;
import com.codecraft.master.entities.Payment;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.AppointmentServicesMapper;
import com.codecraft.master.models.AppointmentServiceDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.ServiceData;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.AppointmentServiceSpecification;
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
public class AppointmentServicesService {

    @Autowired
    AppointmentServiceRepository appointmentServiceRepository;

    @Autowired
    PackageMasterDetailsRepository packageMasterDetailsRepository;


    @Autowired
    AppointmentServicesMapper appointmentServicesMapper;

    @Autowired
    ServicesRepository servicesRepository;

    @Autowired
    PaymentRepository paymentRepository;

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
            if(Objects.nonNull(reqDomain.getLabNoGenerated())) {
                spec = spec.and(Specification.where(AppointmentServiceSpecification.withAppointmentNumberGenerated(reqDomain.getLabNoGenerated()).or(AppointmentServiceSpecification.withPackageType(reqDomain.getLabNoGenerated()))));
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
    public MasterManagerResponse save(AppointmentServiceEntity reqDomain) {
        log.info("AppointmentServicesService : save() started reqDomain {}", reqDomain);
        try {
            if (Objects.isNull(reqDomain.getType())) {
                reqDomain.setType("S");
            }
            if (Objects.isNull(reqDomain.getLabNoGenerated())) {
                reqDomain.setLabNoGenerated("N");
            }
            reqDomain.setActiveInd(1);
            reqDomain = appointmentServiceRepository.save(reqDomain);

            if ("P".equals(reqDomain.getType())) {
                List<PackageMasterDetails> packageMasterDetailsList = packageMasterDetailsRepository.findByPackageId(reqDomain.getServiceId());

                if (!CollectionUtils.isEmpty(packageMasterDetailsList)) {
                    AppointmentServiceEntity finalReqDomain = reqDomain;
                    packageMasterDetailsList.forEach(pmd -> {
                        AppointmentServiceEntity ase = new AppointmentServiceEntity();
                        ase.setServiceId(pmd.getServiceId());
                        ase.setAppointmentId(finalReqDomain.getAppointmentId());
                        ase.setCharges(0.0);
                        ase.setType(pmd.getType());
                        ase.setActiveInd(1);
                        ase.setLabNoGenerated("N");
                        appointmentServiceRepository.save(ase);
                    });
                }
            }
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
        } catch (Exception e) {
            log.error("AppointmentServicesService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        Optional<AppointmentServiceEntity> appointmentServiceEntityOptional = appointmentServiceRepository.findById(id);
        appointmentServiceEntityOptional.ifPresent(appointmentServiceEntity -> {
            if("P".equals(appointmentServiceEntity.getType())){
                List<PackageMasterDetails>  packageMasterDetailsList = packageMasterDetailsRepository.findByPackageId(appointmentServiceEntity.getServiceId());
                packageMasterDetailsList.forEach(packageMasterDetails -> {
                    Optional<AppointmentServiceEntity>  appointmentServiceEnt = appointmentServiceRepository.findByServiceIdAndTypeAndAppointmentIdAndCharges(packageMasterDetails.getServiceId(), appointmentServiceEntity.getPackageType(), appointmentServiceEntity.getAppointmentId(), 0.0);
                    appointmentServiceEnt.ifPresent(appointmentServiceEntity1 -> appointmentServiceRepository.delete(appointmentServiceEntity1));
                });
            }
            appointmentServiceRepository.delete(appointmentServiceEntity);
        });
        return new MasterManagerResponse(MasterConstant.SUCCESS);
    }
}
