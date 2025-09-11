package com.codecraft.master.services.impl;


import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PaymentDTO;
import com.codecraft.master.models.PaymentSearchRequest;
import com.codecraft.master.models.ServiceData;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.PaymentSpecification;
import com.codecraft.master.mappers.PaymentMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;


@Service
@Slf4j
public class PaymentService {


    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    BillingHeaderRepository billingHeaderRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    AppointmentServiceRepository appointmentServiceRepository;

    @Autowired
    PaymentMapper paymentMapper;

    @Autowired
    ServicesRepository servicesRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    DocumentNumberRepository documentNumberRepository;

    @Autowired
    HospitalRepository hospitalRepository;

    @Autowired
    BillService billService;
    @Autowired
    ServiceHelper serviceHelper;

    public MasterManagerResponse search(PaymentSearchRequest reqDomain) {
        log.info("PaymentService : search() started reqDomain {}", reqDomain);
        try {

            Specification<Payment> spec = Specification.where(PaymentSpecification.withHospitalId(UserContext.getHospitalId()));
            spec = spec.and(Specification.where(PaymentSpecification.withIsActive(1)));

            if (Objects.nonNull(reqDomain.getPaymentDate())) {
                spec = spec.and(Specification.where(PaymentSpecification.withPaymentDate(reqDomain.getPaymentDate())));
            }

            if (Objects.nonNull(reqDomain.getPaymentStatus())) {
                spec = spec.and(Specification.where(PaymentSpecification.withPaymentStatus(reqDomain.getPaymentStatus())));
            }

            if (Objects.nonNull(reqDomain.getIsServicePayment())) {
                spec = spec.and(Specification.where(PaymentSpecification.withIsServicePayment(reqDomain.getIsServicePayment())));
            }

            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                spec = spec.and(Specification.where(PaymentSpecification.withAppointmentId(reqDomain.getAppointmentId())));
            }
            if (Objects.nonNull(reqDomain.getPaymentStartDate()) && Objects.nonNull(reqDomain.getPaymentEndDate())) {
                spec = spec.and(Specification.where(PaymentSpecification.withPaymentDateDetween(reqDomain.getPaymentStartDate(), reqDomain.getPaymentEndDate())));
            }
            if (Objects.nonNull(reqDomain.getType())) {
                spec = spec.and(Specification.where(PaymentSpecification.joinType(reqDomain.getType())));
            }

            if (Objects.nonNull(reqDomain.getFirstName())) {
                spec = spec.and(Specification.where(PaymentSpecification.joinFirstName(reqDomain.getFirstName())));
            }
            if (Objects.nonNull(reqDomain.getLastName())) {
                spec = spec.and(Specification.where(PaymentSpecification.joinLastName(reqDomain.getLastName())));
            }

            List<Payment> paymentList = paymentRepository.findAll(spec);
            List<PaymentDTO> paymentDTOList = new ArrayList<>();
            paymentList.forEach(payment -> paymentDTOList.add(getPaymentDTO(payment, appointmentRepository.findById(payment.getAppointment().getId()).get()))); return new MasterManagerResponse(MasterConstant.SUCCESS, paymentDTOList);
        } catch (Exception e) {
            log.error("PaymentService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(PaymentDTO reqDomain) {
        log.info("PaymentService : save() started reqDomain {}", reqDomain);
        try {
            Payment paymentEntity = paymentMapper.paymentDTOToPayment(reqDomain);

            String hospitalCode = hospitalRepository.findById(UserContext.getHospitalId()).get().getHospitalCode();

            paymentEntity.setActiveInd(1);
            paymentEntity.setPaymentDate(new Date());
            paymentEntity.setAppointment(new Appointment(reqDomain.getAppointmentId()));

            paymentEntity.setHospitalId(UserContext.getHospitalId());

            List<Payment> payments = paymentRepository.findByAppointment(new Appointment(reqDomain.getAppointmentId()));

                        if (!CollectionUtils.isEmpty(payments)) {
                paymentEntity.setBillingId(payments.get(0).getBillingId());
                reqDomain.setBillingId(payments.get(0).getBillingId());
            }

            Optional<Appointment> appointmentOptional = appointmentRepository.findById(reqDomain.getAppointmentId());

            if (appointmentOptional.isPresent()) {
                Appointment appointment = appointmentOptional.get();
                BillingHeader header;
                if (Objects.isNull(reqDomain.getBillingId())) {

                    header = new BillingHeader();

                    header.setGrandTotal(paymentEntity.getAmount());

                    if ("PAID".equals(reqDomain.getPaymentStatus())) {
                        header.setPaidAmount(paymentEntity.getAmount());
                        header.setBalanceAmount(0.0);
                    } else {
                        header.setPaidAmount(0.0);
                        header.setBalanceAmount(paymentEntity.getAmount());
                    }

                    header.setBillingDate(new Date());
                    header.setPatientId(appointment.getPatientId());
                    header.setHospitalId(UserContext.getHospitalId());
                    header.setActiveInd(1);
                    header.setAppointmentId(reqDomain.getAppointmentId());
                    Calendar calendar = Calendar.getInstance();

                    Optional<DocumentNumber> docNumber = documentNumberRepository.findByDocTypeAndSubDocTypeAndYearAndHospitalId("Bill", hospitalCode, String.valueOf(calendar.get(Calendar.YEAR)), UserContext.getHospitalId());
                    String billDocumentNumberValue;
                    billDocumentNumberValue = getBillDocumentNumberValue(docNumber, hospitalCode, calendar);
                    header.setDocumentNumber(billDocumentNumberValue);
                    header = billingHeaderRepository.save(header);

                    String documentNumberValue = getPaymentDocumentNumber(hospitalCode);
                    paymentEntity.setDocumentNumber(documentNumberValue);


                    paymentEntity.setBillingId(header.getId());
                    paymentEntity.setServiceId(reqDomain.getServiceId());

                    if (Objects.nonNull(reqDomain.getPaymentStatus())) {
                        paymentEntity.setPaymentStatus(reqDomain.getPaymentStatus());
                    } else {
                        paymentEntity.setPaymentStatus("PAID");
                    }
                    appointment.setStatus("Confirmed");
                    appointment.setActiveInd(1);
                    appointment.setDocumentNumber(appointment.getDocumentNumber());
                } else {
                    Optional<BillingHeader> headerOptional = billingHeaderRepository.findById(reqDomain.getBillingId());
                    header = headerOptional.get();
                    paymentEntity.setBillingId(header.getId());
                    if (Objects.nonNull(reqDomain.getId())) {
                        Optional<Payment> paymentToUpdateOptional = paymentRepository.findById(reqDomain.getId());
                        if (paymentToUpdateOptional.isPresent()) {
                            Payment payment = paymentToUpdateOptional.get();

                            if (!"PAID".equals(reqDomain.getPaymentStatus())) {
                                // header.setBalanceAmount(header.getBalanceAmount()+paymentEntity.getAmount());
                            } else {
                                //appointment.setStatus("Confirmed");
                                header.setBalanceAmount(header.getBalanceAmount() - paymentEntity.getAmount());
                                header.setPaidAmount(header.getPaidAmount() + paymentEntity.getAmount());
                                billingHeaderRepository.save(header);
                            }
                        }
                    } else {
                        String documentNumberValue = getPaymentDocumentNumber(hospitalCode);
                        paymentEntity.setDocumentNumber(documentNumberValue);

                        header.setGrandTotal(header.getGrandTotal() + paymentEntity.getAmount());
                        paymentEntity.setBillingId(header.getId());
                        if (!"PAID".equals(reqDomain.getPaymentStatus())) {
                            header.setBalanceAmount(header.getBalanceAmount() + paymentEntity.getAmount());
                        } else {
                            appointment.setStatus("Confirmed");
                            header.setPaidAmount(header.getPaidAmount() + paymentEntity.getAmount());
                        }

                        header.setBillingDate(new Date());
                        header.setPatientId(appointment.getPatientId());
                        header.setHospitalId(UserContext.getHospitalId());
                        header.setActiveInd(1);
                        header.setAppointmentId(reqDomain.getAppointmentId());
                        billingHeaderRepository.save(header);

                        appointment.setActiveInd(1);

                        if(!CollectionUtils.isEmpty(reqDomain.getAppointmentServiceList())){
                             //extract service name and update description
                            List<ServiceData> serviceDataList = servicesRepository.getAll(UserContext.getHospitalId());

                            StringBuilder descField = new StringBuilder();
                            reqDomain.getAppointmentServiceList().forEach(appointmentServiceEntity -> {
                                        Optional<ServiceData> serviceDataOptional = serviceDataList.stream().filter(serviceData -> serviceData.getType().equalsIgnoreCase(appointmentServiceEntity.getType()) && serviceData.getId().equals(appointmentServiceEntity.getServiceId())).findFirst();
                                        if(serviceDataOptional.isPresent()){
                                            ServiceData serviceData = serviceDataOptional.get();
                                            if(descField.isEmpty()){
                                                descField.append(serviceData.getName());
                                            }else{
                                                descField.append(" ,").append(serviceData.getName());
                                            }

                                            //update reportGenerated field and lab number
                                            Optional<AppointmentServiceEntity> serviceEntityOptional = appointmentServiceRepository.findByServiceIdAndTypeAndAppointmentId(appointmentServiceEntity.getServiceId(),appointmentServiceEntity.getType(), reqDomain.getAppointmentId());
                                            if(serviceEntityOptional.isPresent()){
                                                AppointmentServiceEntity entity = serviceEntityOptional.get();
                                                entity.setPaymentNumber(paymentEntity.getDocumentNumber());
                                                appointmentServiceRepository.save(entity);
                                            }
                                        }
                                    });
                            appointment.setStatus("Casualty Completed");
                            paymentEntity.setDescription(descField.toString());
                        }
                        if (Objects.nonNull(reqDomain.getPaymentStatus())) {
                            paymentEntity.setPaymentStatus(reqDomain.getPaymentStatus());
                        } else {
                            paymentEntity.setPaymentStatus("PAID");
                        }
                    }
                }

                if (Objects.nonNull(reqDomain.getPaymentStatus())) {
                    paymentEntity.setPaymentStatus(reqDomain.getPaymentStatus());
                } else {
                    paymentEntity.setPaymentStatus("PAID");
                }
                paymentEntity.setActiveInd(1);
                Payment pay = paymentRepository.save(paymentEntity);
                appointment.setPaymentStatus(billService.getBillStatus(header.getId()));
                appointmentRepository.save(appointment);

                PaymentDTO payDTO = getPaymentDTO(pay, appointmentRepository.findById(reqDomain.getAppointmentId()).get());
                return new MasterManagerResponse(MasterConstant.DATA_SAVED, payDTO);
            }
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("PaymentService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Transactional
    public MasterManagerResponse saveIPDPayment(PaymentDTO reqDomain) {
        log.info("PaymentService : saveIPDPayment() started reqDomain {}", reqDomain);
        try {
            Payment paymentEntity = paymentMapper.paymentDTOToPayment(reqDomain);

            String hospitalCode = hospitalRepository.findById(UserContext.getHospitalId()).get().getHospitalCode();

            paymentEntity.setActiveInd(1);
            paymentEntity.setPaymentDate(new Date());
            paymentEntity.setHospitalId(UserContext.getHospitalId());

            List<Payment> payments = paymentRepository.findByAppointment(new Appointment(reqDomain.getAppointmentId()));

            if (!CollectionUtils.isEmpty(payments)) {
                paymentEntity.setBillingId(payments.get(0).getBillingId());
                reqDomain.setBillingId(payments.get(0).getBillingId());
            }

            Optional<Appointment> appointmentOptional = appointmentRepository.findById(reqDomain.getAppointmentId());

            if (appointmentOptional.isPresent()) {
                Appointment appointment = appointmentOptional.get();
                BillingHeader header;
                if (Objects.isNull(reqDomain.getBillingId())) {

                    header = new BillingHeader();

                    header.setGrandTotal(paymentEntity.getAmount());

                    if ("PAID".equals(reqDomain.getPaymentStatus())) {
                        header.setPaidAmount(paymentEntity.getAmount());
                        header.setBalanceAmount(0.0);
                    } else {
                        header.setPaidAmount(0.0);
                        header.setBalanceAmount(paymentEntity.getAmount());
                    }

                    header.setBillingDate(new Date());
                    header.setPatientId(appointment.getPatientId());
                    header.setHospitalId(UserContext.getHospitalId());
                    header.setActiveInd(1);
                    header.setAppointmentId(reqDomain.getAppointmentId());
                    Calendar calendar = Calendar.getInstance();

                    Optional<DocumentNumber> docNumber = documentNumberRepository.findByDocTypeAndSubDocTypeAndYearAndHospitalId("Bill", hospitalCode, String.valueOf(calendar.get(Calendar.YEAR)), UserContext.getHospitalId());
                    String billDocumentNumberValue;
                    billDocumentNumberValue = getBillDocumentNumberValue(docNumber, hospitalCode, calendar);
                    header.setDocumentNumber(billDocumentNumberValue);
                    header = billingHeaderRepository.save(header);

                    String documentNumberValue = getPaymentDocumentNumber(hospitalCode);
                    paymentEntity.setDocumentNumber(documentNumberValue);


                    paymentEntity.setBillingId(header.getId());
                    paymentEntity.setServiceId(reqDomain.getServiceId());

                    if (Objects.nonNull(reqDomain.getPaymentStatus())) {
                        paymentEntity.setPaymentStatus(reqDomain.getPaymentStatus());
                    } else {
                        paymentEntity.setPaymentStatus("PAID");
                    }
                    appointment.setStatus("Confirmed");
                    appointment.setActiveInd(1);
                    appointment.setDocumentNumber(appointment.getDocumentNumber());
                } else {
                    Optional<BillingHeader> headerOptional = billingHeaderRepository.findById(reqDomain.getBillingId());
                    header = headerOptional.get();
                    paymentEntity.setBillingId(header.getId());
                    if (Objects.nonNull(reqDomain.getId())) {
                        Optional<Payment> paymentToUpdateOptional = paymentRepository.findById(reqDomain.getId());
                        if (paymentToUpdateOptional.isPresent()) {
                            Payment payment = paymentToUpdateOptional.get();

                            if (!"PAID".equals(reqDomain.getPaymentStatus())) {
                                // header.setBalanceAmount(header.getBalanceAmount()+paymentEntity.getAmount());
                            } else {
                                //appointment.setStatus("Confirmed");
                                header.setBalanceAmount(header.getBalanceAmount() - paymentEntity.getAmount());
                                header.setPaidAmount(header.getPaidAmount() + paymentEntity.getAmount());
                                billingHeaderRepository.save(header);
                            }
                        }
                    } else {
                        String documentNumberValue = getPaymentDocumentNumber(hospitalCode);
                        paymentEntity.setDocumentNumber(documentNumberValue);

                        header.setGrandTotal(header.getGrandTotal() + paymentEntity.getAmount());
                        paymentEntity.setBillingId(header.getId());
                        if (!"PAID".equals(reqDomain.getPaymentStatus())) {
                            header.setBalanceAmount(header.getBalanceAmount() + paymentEntity.getAmount());
                        } else {
                            appointment.setStatus("Confirmed");
                            header.setPaidAmount(header.getPaidAmount() + paymentEntity.getAmount());
                        }

                        header.setBillingDate(new Date());
                        header.setPatientId(appointment.getPatientId());
                        header.setHospitalId(UserContext.getHospitalId());
                        header.setActiveInd(1);
                        header.setAppointmentId(reqDomain.getAppointmentId());
                        billingHeaderRepository.save(header);

                        appointment.setActiveInd(1);

                        if(!CollectionUtils.isEmpty(reqDomain.getAppointmentServiceList())){
                            //extract service name and update description
                            List<ServiceData> serviceDataList = servicesRepository.getAll(UserContext.getHospitalId());

                            StringBuilder descField = new StringBuilder();
                            reqDomain.getAppointmentServiceList().forEach(appointmentServiceEntity -> {
                                Optional<ServiceData> serviceDataOptional = serviceDataList.stream().filter(serviceData -> serviceData.getType().equalsIgnoreCase(appointmentServiceEntity.getType()) && serviceData.getId().equals(appointmentServiceEntity.getServiceId())).findFirst();
                                if(serviceDataOptional.isPresent()){
                                    ServiceData serviceData = serviceDataOptional.get();
                                    if(descField.isEmpty()){
                                        descField.append(serviceData.getName());
                                    }else{
                                        descField.append(" ,").append(serviceData.getName());
                                    }

                                    //update reportGenerated field and lab number
                                    Optional<AppointmentServiceEntity> serviceEntityOptional = appointmentServiceRepository.findByServiceIdAndTypeAndAppointmentId(appointmentServiceEntity.getServiceId(),appointmentServiceEntity.getType(), reqDomain.getAppointmentId());
                                    if(serviceEntityOptional.isPresent()){
                                        AppointmentServiceEntity entity = serviceEntityOptional.get();
                                        entity.setPaymentNumber(paymentEntity.getDocumentNumber());
                                        appointmentServiceRepository.save(entity);
                                    }
                                }
                            });
                            appointment.setStatus("Casualty Completed");
                            paymentEntity.setDescription(descField.toString());
                        }
                        if (Objects.nonNull(reqDomain.getPaymentStatus())) {
                            paymentEntity.setPaymentStatus(reqDomain.getPaymentStatus());
                        } else {
                            paymentEntity.setPaymentStatus("PAID");
                        }
                    }
                }

                if (Objects.nonNull(reqDomain.getPaymentStatus())) {
                    paymentEntity.setPaymentStatus(reqDomain.getPaymentStatus());
                } else {
                    paymentEntity.setPaymentStatus("PAID");
                }
                paymentEntity.setActiveInd(1);
                Payment pay = paymentRepository.save(paymentEntity);
                appointment.setPaymentStatus(billService.getBillStatus(header.getId()));
                appointmentRepository.save(appointment);

                PaymentDTO payDTO = getPaymentDTO(pay, appointmentRepository.findById(reqDomain.getAppointmentId()).get());
                return new MasterManagerResponse(MasterConstant.DATA_SAVED, payDTO);
            }
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("PaymentService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    private String getPaymentDocumentNumber(String hospitalCode) {
        Calendar calendar = Calendar.getInstance();

        Optional<DocumentNumber> docNumber = documentNumberRepository.findByDocTypeAndSubDocTypeAndYearAndHospitalId("Pay", hospitalCode, String.valueOf(calendar.get(Calendar.YEAR)), UserContext.getHospitalId());
        return getPaymentDocumentNumber(docNumber, hospitalCode, calendar);
    }

    private String getPaymentDocumentNumber(Optional<DocumentNumber> docNumber, String hospitalCode, Calendar calendar) {
        DocumentNumber documentNumber;
        String documentNumberValue;
        if (docNumber.isPresent()) {
            documentNumber = docNumber.get();
            documentNumberValue = hospitalCode + "/" + documentNumber.getYear() + "/" + String.format("%07d", documentNumber.getDocumentNumber() + 1);
            documentNumber.setDocumentNumber(documentNumber.getDocumentNumber() + 1);
            documentNumber.setActiveInd(1);
            documentNumberRepository.save(documentNumber);
        } else {
            documentNumberValue = hospitalCode + "/" + calendar.get(Calendar.YEAR) + "/0000001";
            DocumentNumber d = new DocumentNumber();
            d.setDocType("Pay");
            d.setSubDocType(hospitalCode);
            d.setYear(String.valueOf(calendar.get(Calendar.YEAR)));
            d.setHospitalId(UserContext.getHospitalId());
            d.setDocumentNumber(1);
            d.setActiveInd(1);
            documentNumberRepository.save(d);
        }
        return documentNumberValue;
    }

    private String getBillDocumentNumberValue(Optional<DocumentNumber> docNumber, String hospitalCode, Calendar calendar) {
        String billDocumentNumberValue;
        DocumentNumber documentNumber;
        if (docNumber.isPresent()) {
            documentNumber = docNumber.get();
            billDocumentNumberValue = hospitalCode + "/" + documentNumber.getYear() + "/" + String.format("%07d", documentNumber.getDocumentNumber() + 1);
            documentNumber.setDocumentNumber(documentNumber.getDocumentNumber() + 1);
            documentNumber.setActiveInd(1);
            documentNumberRepository.save(documentNumber);
        } else {
            billDocumentNumberValue = hospitalCode + "/" + calendar.get(Calendar.YEAR) + "/0000001";
            DocumentNumber d = new DocumentNumber();
            d.setDocType("Bill");
            d.setSubDocType(hospitalCode);
            d.setYear(String.valueOf(calendar.get(Calendar.YEAR)));
            d.setHospitalId(UserContext.getHospitalId());
            d.setDocumentNumber(1);
            d.setActiveInd(1);
            documentNumberRepository.save(d);
        }
        return billDocumentNumberValue;
    }

    private PaymentDTO getPaymentDTO(Payment pay, Appointment appointment) {
        PaymentDTO payDTO = paymentMapper.paymentToPaymentDTO(pay);
        payDTO.setAppointmentId(appointment.getId());
        payDTO.setFirstName(appointment.getFirstName());
        payDTO.setLastName(appointment.getLastName());
        payDTO.setAppointmentNumber(appointment.getDocumentNumber());
        payDTO.setMobileNumber(appointment.getMobileNumber());
        payDTO.setPaymentNumber(pay.getDocumentNumber());
        payDTO.setType(appointment.getType());
        payDTO.setDescription(pay.getDescription());
        payDTO.setIsServicePayment(pay.getIsServicePayment());
        if (Objects.nonNull(appointment.getPatientId())) {
            Optional<Patient> patientOptional = patientRepository.findByPatientId(appointment.getPatientId());
            patientOptional.ifPresent(patient -> {
                payDTO.setUHIDNumber(patient.getDocumentNumber());
                payDTO.setAadharNumber(patient.getAadharNumber());
            });

            patientOptional.ifPresent(patient -> {
                payDTO.setUHIDNumber(patient.getDocumentNumber());
                payDTO.setAadharNumber(patient.getAadharNumber());
            });
        }
        if (Objects.nonNull(pay.getServiceId())) {
            Optional<Services> serviceOptional = servicesRepository.findById(pay.getServiceId());
            serviceOptional.ifPresent(services -> payDTO.setServiceName(services.getName()));
        }
        payDTO.setCreatedBy(serviceHelper.getNameByEmployeeEmailId(pay.getCreatedBy()));
        return payDTO;
    }

    @Transactional
    public MasterManagerResponse update(Payment reqDomain) {
        log.info("PaymentService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            paymentRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_MODIFY);
        } catch (Exception e) {
            log.error("PaymentService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
