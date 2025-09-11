package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Employee;
import com.codecraft.master.entities.ServiceRate;
import com.codecraft.master.entities.Services;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.ServiceRateDTO;
import com.codecraft.master.repositories.EmployeeRepository;
import com.codecraft.master.repositories.ServiceRateRepository;
import com.codecraft.master.repositories.ServicesRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class ServiceRateService{
	
	@Autowired
	ServiceRateRepository serviceRateRepository;
	
	@Autowired
	ServicesRepository servicesRepository;
	
	@Autowired
	EmployeeRepository userRepository;

	public MasterManagerResponse search(ServiceRate reqDomain) {
		log.info("ServiceRateService : search() started reqDomain {}", reqDomain);
		try {
			List<ServiceRateDTO> serviceRateDomainlist = new ArrayList<>();
			
			List<Services> servicesList = servicesRepository.findByRateChangeApplicable(true);
			
			Optional<Employee> userDetails = userRepository.findByEmployeeId(reqDomain.getEmployeeId());
			
			List<ServiceRate> serviceRateDetails = serviceRateRepository.findByEmployeeId(reqDomain.getEmployeeId());
			servicesList.forEach(service ->{
				ServiceRateDTO serviceRateDomain = new ServiceRateDTO();
				serviceRateDomain.setEmployeeId(reqDomain.getEmployeeId());
				serviceRateDomain.setServiceId(service.getId());
				serviceRateDomain.setServiceName(service.getName());
				serviceRateDomain.setOldServiceRate(service.getRate());
				serviceRateDomain.setHospitalId(UserContext.getHospitalId());
				for(ServiceRate servicesRate : serviceRateDetails) {
					if(Objects.equals(service.getId(), servicesRate.getServiceId())) {
						serviceRateDomain.setCreateTimestamp(servicesRate.getCreateTimestamp());
						serviceRateDomain.setStartDate(servicesRate.getStartDate());
						serviceRateDomain.setServiceRate(servicesRate.getServiceRate());
					}
				}
				serviceRateDomainlist.add(serviceRateDomain);
			});
			return new MasterManagerResponse(MasterConstant.SUCCESS, serviceRateDomainlist);
		} catch (Exception e) {
			log.error("ServiceRateService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(ServiceRate reqDomain) {
		log.info("ServiceRateService : save() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());

			return new MasterManagerResponse(MasterConstant.DATA_SAVED,serviceRateRepository.save(reqDomain));
		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : save() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse update(ServiceRate reqDomain) {
		log.info("ServiceRateService : update() started reqDomain {}", reqDomain);
		try {
			reqDomain.setActiveInd(1);
			reqDomain.setHospitalId(UserContext.getHospitalId());

			serviceRateRepository.save(reqDomain);
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY);
		} catch (Exception e) {
			log.error("ServiceGroupServiceImpl : update() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public MasterManagerResponse searchCharge(ServiceRate serviceRate) {
		log.info("ServiceRateService : search() started reqDomain {}", serviceRate);
		try {
			List<ServiceRateDTO> serviceRateDomainlist = new ArrayList<>();

			List<Services> servicesList = servicesRepository.findAll();

			List<ServiceRate> serviceRateDetails = serviceRateRepository.findByEmployeeId(serviceRate.getEmployeeId());
			servicesList.forEach(service ->{
				ServiceRateDTO serviceRateDomain = new ServiceRateDTO();
				serviceRateDomain.setEmployeeId(serviceRate.getEmployeeId());
				serviceRateDomain.setServiceId(service.getId());
				serviceRateDomain.setOldServiceRate(service.getRate());
				serviceRateDomain.setHospitalId(UserContext.getHospitalId());
				serviceRateDomain.setServiceRate(service.getRate());
				serviceRateDomain.setServiceName(service.getName());
				//Should select latest by start date
				for(ServiceRate servicesRate : serviceRateDetails) {
					if(Objects.equals(service.getId(), servicesRate.getServiceId())) {
						serviceRateDomain.setCreateTimestamp(servicesRate.getCreateTimestamp());
						serviceRateDomain.setStartDate(servicesRate.getStartDate());
						if(serviceRateDomain.getServiceRate()<servicesRate.getServiceRate()) {
							serviceRateDomain.setServiceRate(servicesRate.getServiceRate());
						}
					}
				}

				serviceRateDomainlist.add(serviceRateDomain);
			});

			return new MasterManagerResponse(MasterConstant.SUCCESS, serviceRateDomainlist);
		} catch (Exception e) {
			log.error("ServiceRateService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
