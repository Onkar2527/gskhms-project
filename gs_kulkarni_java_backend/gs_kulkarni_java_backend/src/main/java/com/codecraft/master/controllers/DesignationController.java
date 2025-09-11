package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Designation;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.DesignationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
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
public class DesignationController {

	@Autowired
	DesignationService designationService;

	@PostMapping(value = "/designation/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody Designation  httpEntity) {
		if (Objects.nonNull(httpEntity)) {
			return new ResponseEntity<>( designationService.search(httpEntity), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/designation/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody Designation reqDomain) {
		MasterManagerResponse response = designationService.save(reqDomain);
			return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PutMapping(value = "/designation/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody Designation reqDomain) {
		log.info("DesignationController : update() starting Request Object : {}", reqDomain);
			return new ResponseEntity<>(designationService.update(reqDomain),HttpStatus.OK);
	}
	
}
