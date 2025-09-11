package com.codecraft.master.controllers;


import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PatientDTO;
import com.codecraft.master.services.impl.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
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
public class PatientController {

	@Autowired
	PatientService patientService;

	@PostMapping(value = "/patient/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody Patient patient) {
		if (Objects.nonNull(patient)) {
			return  new ResponseEntity<>(patientService.search(patient), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/patient/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody PatientDTO patient) {
		return  new ResponseEntity<>(patientService.save(patient), HttpStatus.OK);
	}

	@PutMapping(value = "/patient/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody Patient patient) {
		return new ResponseEntity<>(patientService.update(patient), HttpStatus.OK);
	}
}
