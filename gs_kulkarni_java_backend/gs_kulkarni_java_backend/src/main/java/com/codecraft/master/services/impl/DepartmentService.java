package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Department;
import com.codecraft.master.entities.SubDepartment;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.DepartmentRepository;
import com.codecraft.master.repositories.SubDepartmentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DepartmentService{

	@Autowired
	DepartmentRepository departmentRepository;

	@Autowired
	SubDepartmentRepository subDepartmentRepository;

	/**
	 * This method will fetch service department info based on search criteria
	 * @param deptId
	 * @param deptName
	 * @return
	 */
	public MasterManagerResponse search(Integer deptId, String deptName) {
		log.info("DepartmentService : search() started deptId {},  deptName :{}", deptId, deptName);
		try {
			List<Department> deptDetails = departmentRepository.findAll();
			log.info("deptDetails {} ", deptDetails);
			return new MasterManagerResponse(MasterConstant.SUCCESS, deptDetails);
		} catch (Exception e) {
			log.error("DepartmentService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Method save department information
	 * @param departmentDomain
	 */
	@Transactional
	public MasterManagerResponse save(Department departmentDomain) {
		log.info("DepartmentService : save() started departmentDomain {}", departmentDomain);
		try {
			departmentDomain.setActiveInd(1);
			departmentDomain.setHospitalId(UserContext.getHospitalId());
			departmentDomain = departmentRepository.save(departmentDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED, departmentDomain);
		} catch (Exception e) {
			log.error("DepartmentService : save() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Method will update department information
	 * @param departmentDomain
	 */
	@Transactional
	public MasterManagerResponse update(Department departmentDomain) {
		log.info("DepartmentService : update() started departmentDomain {}", departmentDomain);
		try {
			departmentDomain.setActiveInd(1);
			departmentDomain.setHospitalId(UserContext.getHospitalId());
			departmentDomain = departmentRepository.save(departmentDomain);
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY, departmentDomain);
		} catch (Exception e) {
			log.error("DepartmentService : update() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	/**
	 *  This method will delete department 
	 * @param deptId
	 * @return
	 */
	public MasterManagerResponse delete(Integer groupId) {
		log.info("DepartmentService : delete() started groupId {}", groupId);
		try {
			departmentRepository.deleteById(groupId);
			return new MasterManagerResponse(MasterConstant.DATA_DELETE);
		} catch (Exception e) {
			log.error("DepartmentService : delete() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	

	/**
	 * This method will fetch service department info based on search criteria
	 * @param deptId
	 * @param deptName
	 * @return
	 */
	public MasterManagerResponse subDeptSearch(SubDepartment reqDomain) {
		log.info("DepartmentService : search() started", reqDomain);
		try {
			List<SubDepartment> deptDetails = subDepartmentRepository.findByDeptId(reqDomain.getDeptId());
			return new MasterManagerResponse(MasterConstant.SUCCESS, deptDetails);
		} catch (Exception e) {
			log.error("DepartmentService : search() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Method save department information
	 * @param departmentDomain
	 */
	public MasterManagerResponse subDeptSave(SubDepartment departmentDomain) {
		log.info("DepartmentService : save() started departmentDomain {}", departmentDomain);
		try {
			departmentDomain.setHospitalId(UserContext.getHospitalId());
			subDepartmentRepository.save(departmentDomain);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("DepartmentService : save() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Method will update department information
	 * @param departmentDomain
	 */
	public MasterManagerResponse subDeptUpdate(SubDepartment departmentDomain) {
		log.info("DepartmentService : update() started departmentDomain {}", departmentDomain);
		try {
			departmentDomain.setActiveInd(1);
			departmentDomain.setHospitalId(UserContext.getHospitalId());
			subDepartmentRepository.save(departmentDomain);
			return new MasterManagerResponse(MasterConstant.DATA_MODIFY);
		} catch (Exception e) {
			log.error("DepartmentService : update() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	/**
	 *  This method will delete department 
	 * @param deptId
	 * @return
	 */
	public MasterManagerResponse subDeptDelete(Integer groupId) {
		log.info("DepartmentService : delete() started groupId {}", groupId);
		try {
			subDepartmentRepository.deleteById(groupId);
			return new MasterManagerResponse(MasterConstant.DATA_DELETE);
		} catch (Exception e) {
			log.error("DepartmentService : delete() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
