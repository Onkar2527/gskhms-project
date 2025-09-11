package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.BillingDetailsDTO;
import com.codecraft.master.models.BillingHeaderDTO;
import com.codecraft.master.models.BillingHeaderSearchRequest;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.BillingHeaderSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.codecraft.master.mappers.BillingHeaderMapper;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class BillService {

    @Autowired
    BillingHeaderRepository billingHeaderRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    BillingHeaderMapper billingHeaderMapper;

    @Autowired
    ServicesRepository servicesRepository;

    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    ServiceHelper serviceHelper;

    public MasterManagerResponse getBill(Integer billingId) {
        log.info("BillService : search() started reqDomain {}", billingId);
        try {
            Optional<BillingHeader> billingHeaderOptional = billingHeaderRepository.findById(billingId);
            if (billingHeaderOptional.isPresent()) {
                BillingHeader billingHeader = billingHeaderOptional.get();
                BillingHeaderDTO dto = getBillingHeaderDTO(billingId, billingHeader);
                return new MasterManagerResponse(MasterConstant.SUCCESS, dto);
            }
            return new MasterManagerResponse("Not Found", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("BillService : search() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private BillingHeaderDTO getBillingHeaderDTO(Integer billingId, BillingHeader billingHeader) {
        BillingHeaderDTO dto = billingHeaderMapper.billingHeaderToBillingHeaderDTO(billingHeader);

        List<Payment> billingDetails  = paymentRepository.findByBillingId(billingId);
        List<BillingDetailsDTO> billingDTODetails = new ArrayList<>();
        dto.setCreatedBy(serviceHelper.getNameByEmployeeEmailId(billingHeader.getCreatedBy()));
        dto.setBillingStatus("PAID");
        billingDetails.forEach(payment -> {
            BillingDetailsDTO billingDetailsDTO = new BillingDetailsDTO();
            billingDetailsDTO.setBillingId(payment.getBillingId());
            billingDetailsDTO.setServiceId(payment.getServiceId());
            billingDetailsDTO.setId(payment.getId());

            billingDetailsDTO.setDescription(payment.getDescription());
            billingDetailsDTO.setAmount(payment.getAmount());
            billingDetailsDTO.setPaymentNumber(payment.getDocumentNumber());
            if("UNPAID".equalsIgnoreCase(payment.getPaymentStatus())){
                dto.setBillingStatus("UNPAID");
            }

            billingDetailsDTO.setPaymentStatus(payment.getPaymentStatus());
            if(Objects.nonNull(payment.getServiceId())) {
                Optional<Services> servicesOptional = servicesRepository.findById(payment.getServiceId());
                servicesOptional.ifPresent(service -> billingDetailsDTO.setServiceName(service.getName()));
            }
            billingDTODetails.add(billingDetailsDTO);
        });

        dto.setBillingDetailsList(billingDTODetails);

        if (Objects.nonNull(billingHeader.getPatientId())) {
            Optional<Patient> patientOptional = patientRepository.findByPatientId(billingHeader.getPatientId());
            if (patientOptional.isPresent()) {
                Patient patient = patientOptional.get();
                dto.setMobileNumber(patient.getMobileNumber());
                dto.setPatientName(patient.getFirstName() + " " + patient.getLastName());
                dto.setPatientUHIDNumber(patient.getDocumentNumber());
                dto.setAddress(patient.getAddress());
                dto.setAadharNumber(patient.getAadharNumber());

            }
        }
        AtomicReference<Appointment> appointmentObj = new AtomicReference<>();
        if (Objects.nonNull(billingHeader.getAppointmentId())) {
            Optional<Appointment> appointmentOptional = appointmentRepository.findById(billingHeader.getAppointmentId());
            appointmentOptional.ifPresent(appointment -> { appointmentObj.set(appointment);
                dto.setType(appointment.getType());});

        }
        if(Objects.nonNull(appointmentObj.get()) && Objects.nonNull(appointmentObj.get().getDoctorId())){
            Optional<Employee> doctorOptional = employeeRepository.findById(appointmentObj.get().getDoctorId());
            doctorOptional.ifPresent(doctor -> dto.setDoctorName("Dr. "+doctor.getFirstName() + " " + doctor.getLastName()));
        }

        return dto;
    }

    @Transactional
    public MasterManagerResponse save(BillingHeader reqDomain) {
        log.info("BillService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = billingHeaderRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
        } catch (Exception e) {
            log.error("BillService : save() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public MasterManagerResponse search(BillingHeaderSearchRequest billingHeaderSearchRequest) {
        Specification<BillingHeader> spec = Specification.where(BillingHeaderSpecification.withHospitalId(UserContext.getHospitalId()));
        spec = spec.and(Specification.where(BillingHeaderSpecification.withIsActive(1)));

        if (Objects.nonNull(billingHeaderSearchRequest.getBillingDate())) {
            spec = spec.and(Specification.where(BillingHeaderSpecification.withBillDate(billingHeaderSearchRequest.getBillingDate())));
        }


        if (Objects.nonNull(billingHeaderSearchRequest.getAppointmentId())) {
            spec = spec.and(Specification.where(BillingHeaderSpecification.withAppointmentId(billingHeaderSearchRequest.getAppointmentId())));
        }

        if (Objects.nonNull(billingHeaderSearchRequest.getBillingStartDate()) && Objects.nonNull(billingHeaderSearchRequest.getBillingEndDate())) {
            spec = spec.and(Specification.where(BillingHeaderSpecification.withPaymentDateBetween(billingHeaderSearchRequest.getBillingStartDate(), billingHeaderSearchRequest.getBillingEndDate())));
        }


        List<BillingHeader> billingList = billingHeaderRepository.findAll(spec);

        List<BillingHeaderDTO> billingHeaderDTOList = getBillingHeaderDTOS(billingList);
        return new MasterManagerResponse(MasterConstant.DATA_SAVED, billingHeaderDTOList);

    }

    private List<BillingHeaderDTO> getBillingHeaderDTOS(List<BillingHeader> billingList) {
        List<BillingHeaderDTO> billingHeaderDTOList = new ArrayList<>();
        billingList.forEach(billingHeader1 -> {
            billingHeaderDTOList.add(getBillingHeaderDTO(billingHeader1.getId(), billingHeader1));
        });
        return billingHeaderDTOList;
    }

    public MasterManagerResponse searchToday() {
        List<BillingHeader> billingList = billingHeaderRepository.findTodaysBillsByHospitalId(getStartOfDay(new Date()), getEndOfDay(new Date()), UserContext.getHospitalId());
        List<BillingHeaderDTO> billingHeaderDTOList = getBillingHeaderDTOS(billingList);
        return new MasterManagerResponse(MasterConstant.DATA_SAVED, billingHeaderDTOList);
    }

    public MasterManagerResponse searchPast() {
        List<BillingHeader> billingList = billingHeaderRepository.findTodaysBillsByHospitalIdPast(getStartOfDay(new Date()), UserContext.getHospitalId());
        List<BillingHeaderDTO> billingHeaderDTOList = getBillingHeaderDTOS(billingList);
        return new MasterManagerResponse(MasterConstant.DATA_SAVED, billingHeaderDTOList);
    }

    public String getBillStatus(Integer billingId){
        List<Payment> billingDetails  = paymentRepository.findByBillingId(billingId);
        AtomicReference<String> paymentStatus = new AtomicReference<>("PAID");
        billingDetails.forEach(payment -> {
            if("UNPAID".equalsIgnoreCase(payment.getPaymentStatus())){
                paymentStatus.set("UNPAID");
            }
        });
        return paymentStatus.get();
    }

    public static Date getStartOfDay(Date date) {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("IST"));
        cal.setTime(date);
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH);
        int day = cal.get(Calendar.DAY_OF_MONTH);
        cal.set(year, month, day, 0, 0, 0);
        return cal.getTime();
    }


    public static Date getEndOfDay(Date date) {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("IST"));
        cal.setTime(date);
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH);
        int day = cal.get(Calendar.DAY_OF_MONTH);
        cal.set(year, month, day, 23, 59, 59);
        return cal.getTime();
    }
}
