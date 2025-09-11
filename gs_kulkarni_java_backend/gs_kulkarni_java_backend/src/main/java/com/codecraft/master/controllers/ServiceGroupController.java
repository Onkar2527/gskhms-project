package com.codecraft.master.controllers;


import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.ServiceGroup;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.ServiceGroupService;
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

import java.util.Objects;

@RestController
@CrossOrigin
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/mastermanager")
@Slf4j
public class ServiceGroupController {

	@Autowired
	ServiceGroupService serviceGroupService;

	@PostMapping(value = "/servicegroup/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody ServiceGroup serviceGroup) {
		if (Objects.nonNull(serviceGroup)) {
			return new ResponseEntity<>(serviceGroupService.search(serviceGroup), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/servicegroup/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody ServiceGroup ServiceGroup) {
			return new ResponseEntity<>(serviceGroupService.save(ServiceGroup), HttpStatus.OK);
	}
	
	@PutMapping(value = "/servicegroup/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody ServiceGroup ServiceGroup) {
			return new ResponseEntity<>(serviceGroupService.update(ServiceGroup), HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/servicegroup/delete")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> delete(@QueryParam(value = "groupId") Integer groupId) {
			return new ResponseEntity<>(serviceGroupService.delete(groupId), HttpStatus.OK);
	}
}
