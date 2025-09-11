package com.codecraft.master.controllers;

import com.codecraft.master.entities.Department;
import com.codecraft.master.entities.SubDepartment;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/mastermanager")
@Slf4j
public class DepartmentController {

	@Autowired
	DepartmentService departmentService;
	
	@PostMapping(value = "/dept/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@QueryParam(value = "deptId") Integer deptId, @QueryParam(value = "deptName") String deptName) {
			return new ResponseEntity<>(departmentService.search(deptId, deptName), HttpStatus.OK);

	}
	
	@PostMapping(value = "/dept/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody Department departmentDomain) {
			return new ResponseEntity<>(departmentService.save(departmentDomain), HttpStatus.OK);
	}
	
	@PutMapping(value = "/dept/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody Department departmentDomain) {
			return new ResponseEntity<>(departmentService.update(departmentDomain), HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/dept/delete")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> delete(@QueryParam(value = "deptId") Integer deptId) {
			return new ResponseEntity<>(departmentService.delete(deptId), HttpStatus.OK);
	}
	
	@PostMapping(value = "/dept/subdept/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> subDeptSearch(@RequestBody SubDepartment reqDomain) {
			return new ResponseEntity<>(departmentService.subDeptSearch(reqDomain),HttpStatus.OK);

	}
	
	@PostMapping(value = "/dept/subdept/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> subDeptSave(@RequestBody SubDepartment departmentDomain) {
			return new ResponseEntity<>(departmentService.subDeptSave(departmentDomain),HttpStatus.OK);
	}
	
	@PutMapping(value = "/dept/subdept/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> subDeptUpdate(@RequestBody SubDepartment departmentDomain) {
			return new ResponseEntity<>(departmentService.subDeptUpdate(departmentDomain), HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/dept/subdept/delete")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> subDeptDelete(@QueryParam(value = "deptId") Integer deptId) {
			return new ResponseEntity<>(departmentService.subDeptDelete(deptId), HttpStatus.OK);
	}
}
