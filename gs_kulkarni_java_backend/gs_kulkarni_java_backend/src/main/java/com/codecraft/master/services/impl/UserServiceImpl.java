package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.EmployeeMapper;
import com.codecraft.master.mappers.PayoutDetailsMapper;
import com.codecraft.master.models.*;
import com.codecraft.master.repositories.DesignationRepository;
import com.codecraft.master.repositories.SpecializationRepository;
import com.codecraft.master.repositories.EmployeeRepository;
import com.codecraft.master.repositories.HospitalRepository;
import com.codecraft.master.repositories.PayoutDetailsRepository;
import com.codecraft.master.services.UserService;
import com.codecraft.master.specifications.EmployeeSpecification;
import com.codecraft.master.utility.PasswordUtility;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.codecraft.master.services.JwtService;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    HospitalRepository hospitalRepository;

    @Autowired
    private PasswordUtility passwordUtility;

    @Autowired
    private PayoutDetailsMapper payoutDetailsMapper;

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    PayoutDetailsRepository payoutDetailsRepository;

    @Autowired
    DesignationRepository designationRepository;

    @Autowired
    SpecializationRepository specializationRepository;

    @Autowired
    UploadDocumentService uploadDocumentService;
    @Override
        public MasterManagerResponse search(Employee employee) {

        Specification<Employee> spec = Specification.where(EmployeeSpecification.withHospitalId(UserContext.getHospitalId()));
        spec = spec.and(Specification.where(EmployeeSpecification.withActiveInd(1)));
        if(Objects.nonNull(employee.getUserType())){
            spec = spec.and(Specification.where(EmployeeSpecification.withType(employee.getUserType())));
        } else {
            spec = spec.and(Specification.where(EmployeeSpecification.withNotType("D")));
        }
        if(Objects.nonNull(employee.getMobileNumber())){
            spec = spec.and(Specification.where(EmployeeSpecification.withMobileNumber(employee.getMobileNumber())));
        }
        if(Objects.nonNull(employee.getEmployeeId())){
            spec = spec.and(Specification.where(EmployeeSpecification.withEmployeeId(employee.getEmployeeId())));
        }
        if(Objects.nonNull(employee.getEmailId())){
            spec = spec.and(Specification.where(EmployeeSpecification.withEmailId(employee.getEmailId())));
        }
        if(Objects.nonNull(employee.getStatus())){
            spec = spec.and(Specification.where(EmployeeSpecification.withStatus(employee.getStatus())));
        }
        List<Employee> employeeList = employeeRepository.findAll(spec);

        List<EmployeeDTO> employeeDTOList = new ArrayList<>();
        employeeList.forEach(employeeObj -> {
            EmployeeDTO empDTO = employeeMapper.employeeToEmployeeDTO(employeeObj);
            if(Objects.nonNull(empDTO.getDesignationId())){
                Optional<Designation> designationOptional = designationRepository.findById(empDTO.getDesignationId());
                designationOptional.ifPresent(designation -> empDTO.setDesignationName(designation.getName()));
            }
            if(Objects.nonNull(empDTO.getSpecializationId())){
                Optional<Specialization> specializationOptional = specializationRepository.findById(empDTO.getSpecializationId());
                specializationOptional.ifPresent(specialization -> empDTO.setSpecializationName(specialization.getName()));
            }
            Optional<PayoutDetails> payoutDetailsOptional = payoutDetailsRepository.findByEmployeeId(empDTO.getEmployeeId());
            payoutDetailsOptional.ifPresent(payoutDetails -> empDTO.setPayoutDetails(payoutDetailsMapper.payoutDetailsToPayoutDetailsDTO(payoutDetails)));
            employeeDTOList.add(empDTO);
        });

        return new MasterManagerResponse("Success", employeeDTOList);
    }

    @Override
    @Transactional
    public MasterManagerResponse save(Employee employee) {
        if(Objects.nonNull(employee.getPassword())) {
            employee.setPassword(passwordUtility.encryptPassword(employee.getPassword()));
        }
        employee.setActiveInd(1);
        return new MasterManagerResponse("Success", employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public MasterManagerResponse update(String user, MultipartFile file) {

        Employee employee ;
        if (Objects.nonNull(user)) {
            employee = getJson(user);
            employee.setActiveInd(1);
            Optional<Employee> existingEmployee = employeeRepository.findByEmailId(employee.getEmailId());
            if(existingEmployee.isPresent()) {
                employee.setPassword(existingEmployee.get().getPassword());
                employee.setEmployeeId(existingEmployee.get().getEmployeeId());
            }
            employee = employeeRepository.save(employee);
        if(Objects.nonNull(file)) {
            UploadDocument uploadDocumentData = uploadDocumentService.save(employee.getEmployeeId(), "user", "Profile", employee.getHospitalId(), file);
            employee.setPhoto(uploadDocumentData.getDocPath());
            employee = employeeRepository.save(employee);
        }
            return new MasterManagerResponse(MasterConstant.DATA_MODIFY, employee);
        }
        throw new RuntimeException(MasterConstant.SYSTEM_ERROR_MSG);
    }

    @Override
    public MasterManagerResponse delete(String userId) {
        return null;
    }

    @Override
    public MasterManagerResponse validateUser(String email, String password) {
        log.info("UserServiceImpl : validateUser() started id {}", email);

        boolean validPassword = false;
        Optional<Employee> employees = employeeRepository.findByEmailId(email);
        Employee employee;
        if (employees.isPresent()) {
            employee = employees.get();
            validPassword = passwordUtility.checkPassword(password, employee.getPassword());

            if (!validPassword) {
                log.info("UserServiceImpl : validateUser() user not exist: {}", email);
                return new MasterManagerResponse(MasterConstant.INVALID_CREDENTIALS, email);
            } else {
                EmployeeLoginResponse response = new EmployeeLoginResponse();
                BeanUtils.copyProperties(employee, response);
                Optional<Hospital> hospitalOptional = hospitalRepository.findById(employee.getHospitalId());

                if(hospitalOptional.isPresent()){
                    Hospital hospital = hospitalOptional.get();
                    response.setHospitalCode(hospital.getHospitalCode());
                    response.setLabServices(hospital.getLabServices());
                    response.setXrayServices(hospital.getXrayServices());
                    response.setIpdServices(hospital.getIpdServices());
                    response.setInsuranceAvailable(hospital.getInsuranceAvailable());
                    response.setDiscountApplicable(hospital.getDiscountApplicable());
                }
                LoginResponse loginResponse = new LoginResponse();
                loginResponse.setUserList(List.of(response));
                String jwtToken = jwtService.generateToken(employee);
                loginResponse.setToken(jwtToken);
                loginResponse.setExpiresIn(jwtService.getExpirationTime());
               return new MasterManagerResponse(MasterConstant.SUCCESS, loginResponse);
            }
        }
        return new MasterManagerResponse(MasterConstant.INVALID_CREDENTIALS, email);
    }

    @Override
    public MasterManagerResponse getCurrentLoggedInUsers(Integer compId) {
        return null;
    }

    @Override
    public MasterManagerResponse updatePassword(Integer employeeId, Employee employeeObj) {
        log.info("UserServiceImpl : updatePassword() started userID {}, password {} ", employeeId, employeeObj.getPassword());
        try {
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(employeeId);
            if (employeeOptional.isPresent()) {
                Employee employee = employeeOptional.get();
                if(Objects.nonNull(employee.getPassword())) {
                    employee.setPassword(passwordUtility.encryptPassword(employeeObj.getPassword()));
                }
                employeeRepository.save(employee);
                return new MasterManagerResponse("Password updated Successfully");
            } else {
                log.info("UserServiceImpl : updatePassword() user not exist: {}", employeeId);
                throw new MasterManagerException(MasterConstant.USER_NOT_EXIST, HttpStatus.BAD_REQUEST);
            }
        }
        catch (MasterManagerException e) {
            log.error("UserServiceImpl : updatePassword() Exception occured while saving updattng pass information", e);
            throw new MasterManagerException(e.getMessage(),e.getStatus());
        }
        catch (Exception e) {
            log.error("UserServiceImpl : updatePassword() Exception occured while saving updattng pass information", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public MasterManagerResponse save(String user, MultipartFile file) {
        Employee employee;
        if (Objects.nonNull(user)) {
            employee = getJson(user);
            employee.setActiveInd(1);
        } else {
            throw new RuntimeException("Request should contain user data");
        }
        if(Objects.nonNull(employee.getPassword())) {
            employee.setPassword(passwordUtility.encryptPassword(employee.getPassword()));
        }
        Employee employeeData = employeeRepository.save(employee);
        if (Objects.nonNull(file) && employeeData.getEmployeeId() != null) {
            	UploadDocument uploadDocumentData = uploadDocumentService.save(employeeData.getEmployeeId(), "user",
            			"Profile", employeeData.getHospitalId(), file);
            	employee.setPhoto(uploadDocumentData.getDocPath());
            employeeData = employeeRepository.save(employee);
        }

        return new MasterManagerResponse("SUCCESS", employeeData);
    }

    @Override
    public Employee loadUserByUsername(String userName) {
        return employeeRepository.findByEmailId(userName).get();
    }

    @Override
    public MasterManagerResponse updatePasswordByEmailId(Employee employeeDetails) {
        try {
            Optional<Employee> employeeOptional = employeeRepository.findByEmailId(employeeDetails.getEmailId());
            if (employeeOptional.isPresent()) {
                Employee employee = employeeOptional.get();
                employee.setPassword(passwordUtility.encryptPassword(employeeDetails.getPassword()));
                employeeRepository.save(employee);
                return new MasterManagerResponse("Password updated Successfully");
            } else {
                log.info("UserServiceImpl : updatePassword() user not exist: {}", employeeDetails);
                throw new MasterManagerException(MasterConstant.USER_NOT_EXIST, HttpStatus.BAD_REQUEST);
            }
        }
        catch (MasterManagerException e) {
            log.error("UserServiceImpl : updatePassword() Exception occured while saving updattng pass information", e);
            throw new MasterManagerException(e.getMessage(),e.getStatus());
        }
        catch (Exception e) {
            log.error("UserServiceImpl : updatePassword() Exception occured while saving updattng pass information", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public MasterManagerResponse doctorSave(EmployeeDTO doctorDTO) {
        Employee employee = employeeMapper.employeeDTOToEmployee(doctorDTO);

        if(Objects.nonNull(employee.getPassword())) {
            employee.setPassword(passwordUtility.encryptPassword(employee.getPassword()));
        }
        employee.setActiveInd(1);
        employee = employeeRepository.save(employee);

        PayoutDetailsDTO payoutDetailsDTO =null;
        if(Objects.nonNull(doctorDTO.getPayoutDetails())) {
            PayoutDetails payoutDetails = payoutDetailsMapper.payoutDetailsDTOToPayoutDetails(doctorDTO.getPayoutDetails());
            payoutDetails.setEmployeeId(employee.getEmployeeId());
            payoutDetails.setActiveInd(1);
            payoutDetails = payoutDetailsRepository.save(payoutDetails);
            payoutDetailsDTO = payoutDetailsMapper.payoutDetailsToPayoutDetailsDTO(payoutDetails);
        }

        doctorDTO = employeeMapper.employeeToEmployeeDTO(employee);
        doctorDTO.setPayoutDetails(payoutDetailsDTO);
        return new MasterManagerResponse("Success",doctorDTO );
    }

    @Override
    public MasterManagerResponse doctorUpdate(EmployeeDTO doctorDTO) {
        Employee employee = employeeMapper.employeeDTOToEmployee(doctorDTO);

        if(Objects.nonNull(employee.getPassword())) {
            employee.setPassword(passwordUtility.encryptPassword(employee.getPassword()));
        }
        employee.setActiveInd(1);
        employee = employeeRepository.save(employee);

        PayoutDetailsDTO payoutDetailsDTO =null;
        if(Objects.nonNull(doctorDTO.getPayoutDetails())) {
            PayoutDetails payoutDetails = payoutDetailsMapper.payoutDetailsDTOToPayoutDetails(doctorDTO.getPayoutDetails());
            payoutDetails.setEmployeeId(employee.getEmployeeId());
            payoutDetails.setActiveInd(1);
            payoutDetails = payoutDetailsRepository.save(payoutDetails);
            payoutDetailsDTO = payoutDetailsMapper.payoutDetailsToPayoutDetailsDTO(payoutDetails);
        }

        doctorDTO = employeeMapper.employeeToEmployeeDTO(employee);
        doctorDTO.setPayoutDetails(payoutDetailsDTO);
        return new MasterManagerResponse("Success",doctorDTO );
    }

    private Employee getJson(String user) {
        Employee userDomain = new Employee();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            userDomain = objectMapper.readValue(user, Employee.class);
        }catch (IOException ex){
            log.error("Exception occurred while converting user json");
        }
        return userDomain;
    }
}