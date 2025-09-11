package com.codecraft.master.services.impl;


import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.Employee;
import com.codecraft.master.entities.PayoutDetails;
import com.codecraft.master.entities.Services;
import com.codecraft.master.mappers.AppointmentMapper;
import com.codecraft.master.models.*;
import com.codecraft.master.repositories.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.*;

@Service
@Slf4j
public class DashboardService {

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    ServicesRepository servicesRepository;

    @Autowired
    AppointmentMapper appointmentMapper;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    PayoutDetailsRepository payoutDetailsRepository;

    public MasterManagerResponse getReceptionDashboard(ReceptionDashboardRequest receptionDashboardRequest) throws ParseException {


        ReceptionDashboardResponse response = new ReceptionDashboardResponse();
        response.setHospitalId(UserContext.getHospitalId());
        RegistrationDTO todayPatients = new RegistrationDTO();

        todayPatients.setTotal(appointmentRepository.countByHospitalIdAndAppointmentDate(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date())));

        Optional<Services> servicesConsultationOptional = servicesRepository.findByName("Consultation");
        servicesConsultationOptional.ifPresent(services -> todayPatients.setNewReq(appointmentRepository.countByHospitalIdAndAppointmentDateAndServiceId(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), services.getId())));

        Optional<Services> servicesFollowOptional = servicesRepository.findByName("Follow Up");
        servicesFollowOptional.ifPresent(services -> todayPatients.setFollowUp(appointmentRepository.countByHospitalIdAndAppointmentDateAndServiceId(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), services.getId())));

        response.setTodaysPatient(todayPatients);


        RegistrationDTO confirmedRegistrations = new RegistrationDTO();

        confirmedRegistrations.setTotal(appointmentRepository.countByHospitalIdAndAppointmentDateAndStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), "Confirmed"));

        servicesConsultationOptional.ifPresent(services -> confirmedRegistrations.setNewReq(appointmentRepository.countByHospitalIdAndAppointmentDateAndServiceIdAndStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), services.getId(), "Confirmed")));

        servicesFollowOptional.ifPresent(services -> confirmedRegistrations.setFollowUp(appointmentRepository.countByHospitalIdAndAppointmentDateAndServiceIdAndStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), services.getId(), "Confirmed")));

        response.setConfirmedRegistrations(confirmedRegistrations);


        RegistrationDTO waitingRegistrations = new RegistrationDTO();

		waitingRegistrations.setTotal(appointmentRepository.countByHospitalIdAndAppointmentDateAndStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), "Waiting"));

        servicesConsultationOptional.ifPresent(services -> waitingRegistrations.setNewReq(appointmentRepository.countByHospitalIdAndAppointmentDateAndServiceIdAndStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), services.getId(), "Waiting")));

        servicesFollowOptional.ifPresent(services -> waitingRegistrations.setFollowUp(appointmentRepository.countByHospitalIdAndAppointmentDateAndServiceIdAndStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), services.getId(), "Waiting")));

        response.setWaitingRegistrations(waitingRegistrations);


        return new MasterManagerResponse(MasterConstant.SUCCESS, response);
    }

    public MasterManagerResponse getDoctorDashboard(DoctorDashboardRequest doctorDashboardRequest) {
        DoctorDashboardResponse response = new DoctorDashboardResponse();

        response.setHospitalId(doctorDashboardRequest.getHospitalId());
        response.setTodayAppointments(appointmentRepository.countByHospitalIdAndAppointmentDate(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date())));

        Optional<Employee>  employeeOptional = employeeRepository.findByEmailId(UserContext.getCurrentUser());

        if(employeeOptional.isPresent()){
            Employee employee = employeeOptional.get();
            response.setTotalDoctorAppointments(appointmentRepository.countByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId()));
            response.setTotalDoctorWaitingAppointments(appointmentRepository.countByHospitalIdAndAppointmentDateAndDoctorIdAndStatus(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId(), "Waiting"));
            response.setTotalDoctorAttendedAppointments(appointmentRepository.countByHospitalIdAndAppointmentDateAndDoctorIdAndStatus(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId(), "Completed"));
            response.setTotalDoctorConfirmedAppointments(appointmentRepository.countByHospitalIdAndAppointmentDateAndDoctorIdAndStatus(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId(), "Confirmed"));

            Optional<PayoutDetails> payoutDetailsOptional = payoutDetailsRepository.findByEmployeeId(employee.getEmployeeId());

            if(payoutDetailsOptional.isPresent()){
                PayoutDetails payoutDetails = payoutDetailsOptional.get();

                if(Objects.nonNull(payoutDetails.getPayoutType())){
                    response.setPayoutType(payoutDetails.getPayoutType());
                    if("S".equalsIgnoreCase(payoutDetails.getPayoutType())){
                        response.setSalary(payoutDetails.getSalary());
                        response.setDoctorEarning(0.0);
                        response.setTodayDoctorEarning(0.0);
                    }
                    if("SI".equalsIgnoreCase(payoutDetails.getPayoutType())){
                        response.setSalary(payoutDetails.getSalary());

                        List<Integer> appointmentIds = appointmentRepository.findByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId());
                        List<Appointment> appointmentts = appointmentRepository.findAppointmentByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId());

                        List<Integer> serviceIds = servicesRepository.findByNameIn(List.of("Consultation", "Follow Up"));

                        if("P".equals(payoutDetails.getIncentiveBasedOn())) {
                            Long todayAppointments = appointmentRepository.countByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId());
                            if(Objects.nonNull(payoutDetails.getPatientCount()) && todayAppointments > payoutDetails.getPatientCount()) {
                                response.setTodayDoctorEarning((todayAppointments-payoutDetails.getPatientCount() ) * payoutDetails.getPerPatientAmount());
                            }else{
                                response.setTodayDoctorEarning(0.0);
                            }

                            Long appointments = appointmentRepository.countByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfMonth(), getEndOfMonth(), employee.getEmployeeId());
                            if(Objects.nonNull(payoutDetails.getPatientCount()) && appointments > payoutDetails.getPatientCount()*30) {
                                response.setDoctorEarning((appointments-payoutDetails.getPatientCount()*30 ) * payoutDetails.getPerPatientAmount());
                            }else{
                                response.setDoctorEarning(0.0);
                            }
                        }
                        if("C".equals(payoutDetails.getIncentiveBasedOn())) {
                            Double todayEarnedMoney = paymentRepository.sumByHospitalIdAndAppointmentIdInAndServiceIdInAndPaymentDateAndPaymentStatus(UserContext.getHospitalId(), appointmentts, serviceIds, getStartOfDay(new Date()), getEndOfDay(new Date()), "PAID");
                            if(Objects.nonNull(payoutDetails.getCollectionPercentage())  && Objects.nonNull(payoutDetails.getCollectionLimit()) && payoutDetails.getCollectionLimit() < todayEarnedMoney) {
                                response.setTodayDoctorEarning((todayEarnedMoney-payoutDetails.getCollectionLimit() ) * payoutDetails.getCollectionPercentage()/100);
                            }else{
                                response.setTodayDoctorEarning(0.0);
                            }

                            Double totalEarnedMoney = paymentRepository.sumByHospitalIdAndAppointmentIdInAndServiceIdInAndPaymentDateAndPaymentStatus(UserContext.getHospitalId(),appointmentts, serviceIds, getStartOfMonth(), getEndOfMonth(), "PAID");
                            if(Objects.nonNull(payoutDetails.getCollectionPercentage())  && Objects.nonNull(payoutDetails.getCollectionLimit()) && payoutDetails.getCollectionLimit()*30 < totalEarnedMoney) {
                                response.setDoctorEarning((totalEarnedMoney - payoutDetails.getCollectionLimit()*30 ) * payoutDetails.getCollectionPercentage()/100);
                            }else{
                                response.setDoctorEarning(0.0);
                            }
                        }
                    }
                    if("CS".equalsIgnoreCase(payoutDetails.getPayoutType())){
                        response.setSalary(0.0);
                        List<Appointment> todayAppointmentIds = appointmentRepository.findAppointmentByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId());List<Integer> serviceIds = servicesRepository.findByNameIn(List.of("Consultation", "Follow Up"));

                        Double todayEarnedMoney = paymentRepository.sumByHospitalIdAndAppointmentIdInAndServiceIdInAndPaymentDateAndPaymentStatus(UserContext.getHospitalId(),todayAppointmentIds, serviceIds, getStartOfDay(new Date()), getEndOfDay(new Date()), "PAID");
                        if(Objects.nonNull(todayEarnedMoney)  && todayEarnedMoney>0) {
                            response.setTodayDoctorEarning((todayEarnedMoney * payoutDetails.getRevenuePercentageShare()/100));
                        }

                        List<Appointment> appointmentIds = appointmentRepository.findAppointmentByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfMonth(), getEndOfMonth(), employee.getEmployeeId());
                        Double earnedMoney = paymentRepository.sumByHospitalIdAndAppointmentIdInAndServiceIdInAndPaymentDateAndPaymentStatus(UserContext.getHospitalId(),appointmentIds, serviceIds, getStartOfMonth(), getEndOfMonth(), "PAID");
                        if(Objects.nonNull(earnedMoney)  && earnedMoney>0) {
                            response.setDoctorEarning(earnedMoney * payoutDetails.getRevenuePercentageShare()/100);
                        }
                    }

                    if("OC".equalsIgnoreCase(payoutDetails.getPayoutType())){
                        response.setSalary(0.0);
                        Long todayAppointments = appointmentRepository.countByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), employee.getEmployeeId());
                        response.setTodayDoctorEarning(todayAppointments * payoutDetails.getOnCallServiceCharges());

                        Long appointments = appointmentRepository.countByHospitalIdAndAppointmentDateAndDoctorId(doctorDashboardRequest.getHospitalId(), getStartOfMonth(), getEndOfMonth(), employee.getEmployeeId());
                        response.setDoctorEarning(appointments * payoutDetails.getOnCallServiceCharges());
                    }
                }
            }
        }

        return new MasterManagerResponse(MasterConstant.SUCCESS, response);
    }

    public MasterManagerResponse getAdminDashboard(AdminDashboardRequest adminDashboardRequest) {
        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setHospitalId(adminDashboardRequest.getHospitalId());
        long todayAppointmentsCount = appointmentRepository.countByHospitalIdAndAppointmentDate(adminDashboardRequest.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()));
        response.setTodayAppointments(todayAppointmentsCount);

        Optional<Services> servicesConsultationOptional = servicesRepository.findByName("Consultation");
        servicesConsultationOptional.ifPresent(services -> response.setTodayNewReq(appointmentRepository.countByHospitalIdAndAppointmentDateAndServiceId(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), services.getId())));

        response.setTodayEarning(paymentRepository.sumByHospitalIdAndPaymentDateAndPaymentStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), "PAID"));

        return new MasterManagerResponse(MasterConstant.SUCCESS, response);
    }

    public MasterManagerResponse getBillingDashboard(BillingDashboardRequest billingDashboardRequest) {
        BillingDashboardResponse response = new BillingDashboardResponse();
        response.setHospitalId(billingDashboardRequest.getHospitalId());

        response.setTodayEarning(paymentRepository.sumByHospitalIdAndPaymentDateAndPaymentStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), "PAID"));
        response.setTodayEarningCash(paymentRepository.sumByHospitalIdAndPaymentDateAndPaymentStatusAndPaymentMode(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), "PAID", "cash"));
        response.setTodayEarningOnline(paymentRepository.sumByHospitalIdAndPaymentDateAndPaymentStatusAndPaymentMode(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), "PAID", "online"));

        Optional<Services> servicesConsultationOptional = servicesRepository.findByName("Consultation");
        servicesConsultationOptional.ifPresent(services -> response.setTodayNewReq(appointmentRepository.countByHospitalIdAndAppointmentDateAndServiceId(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), services.getId())));

        response.setTodayOperations(0L);

        response.setTodayRegistrationConfirmed(appointmentRepository.countByHospitalIdAndAppointmentDateAndStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), "Confirmed"));
        response.setTodayAppointments(appointmentRepository.countByHospitalIdAndAppointmentDate(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date())));
        response.setTodayRegistrations(appointmentRepository.countByHospitalIdAndAppointmentDate(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date())));
        response.setTodayRegistrationWaiting(appointmentRepository.countByHospitalIdAndAppointmentDateAndStatus(UserContext.getHospitalId(), getStartOfDay(new Date()), getEndOfDay(new Date()), "Waiting"));

        return new MasterManagerResponse(MasterConstant.SUCCESS, response);
    }

    public MasterManagerResponse getLabDashboard(LabDashboardRequest labDashboardRequest) {
        LabDashboardRequest response = new LabDashboardRequest();
        response.setHospitalId(labDashboardRequest.getHospitalId());
        return new MasterManagerResponse(MasterConstant.SUCCESS, response);
    }

    public MasterManagerResponse getNurseDashboard(NurseDashboardRequest nurseDashboardRequest) {
        LabDashboardRequest response = new LabDashboardRequest();
        response.setHospitalId(nurseDashboardRequest.getHospitalId());
        return new MasterManagerResponse(MasterConstant.SUCCESS, response);
    }

    public static Date getStartOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DATE);
        calendar.set(year, month, day, 0, 0, 0);
        return calendar.getTime();
    }


    public static Date getEndOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DATE);
        calendar.set(year, month, day, 23, 59, 59);
        return calendar.getTime();
    }


    public static Date getStartOfMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = 1;
        calendar.set(year, month, day, 0, 0, 0);
        return calendar.getTime();
    }


    public static Date getEndOfMonth() {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
        calendar.set(year, month, day, 23, 59, 59);
        return calendar.getTime();
    }
}
