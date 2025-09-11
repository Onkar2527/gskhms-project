package com.codecraft.master.services.impl;

import com.codecraft.master.entities.Employee;
import com.codecraft.master.entities.Hospital;
import com.codecraft.master.repositories.EmployeeRepository;
import com.codecraft.master.repositories.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Optional;

@Service
public class ServiceHelper {

    @Autowired
    EmployeeRepository employeeRepository;


    @Autowired
    HospitalRepository hospitalRepository;


    String getNameByEmployeeEmailId(String emailId){
        Optional<Employee> employeeOptional = employeeRepository.findByEmailId(emailId);
        if(employeeOptional.isPresent()){
            return employeeOptional.get().getFirstName()+" "+employeeOptional.get().getLastName();
        }

        return "";
    }

    String getHospitalCodeByHospitalId(Integer id){
        Optional<Hospital> hospitalOptional = hospitalRepository.findById(id);
        if(hospitalOptional.isPresent()){
            return hospitalOptional.get().getHospitalCode();
        }
        return "";
    }

    public String randomDigitsUHID() {
        SecureRandom random = new SecureRandom();
        char[] digits = new char[14];
        // Make sure the leading digit isn't 0.
        digits[0] = (char) ('1' + random.nextInt(9));
        for (int i = 1; i < 14; i++) {
            digits[i] = (char) ('0' + random.nextInt(10));
        }
        return new String(digits);
    }
}
