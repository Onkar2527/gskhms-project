package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.LabRegistrationDTO;
import com.codecraft.master.models.LabRegistrationSearchDTO;
import com.codecraft.master.models.LabRegistrationStatusDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.LabRegistrationService;
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
public class LabRegistrationController {

	@Autowired
	LabRegistrationService labRegistrationService;

	@PostMapping(value = "/labregistration/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody LabRegistrationSearchDTO registrationSearchDTO) {
		if (Objects.nonNull(registrationSearchDTO)) {
			return new ResponseEntity<>(labRegistrationService.search(registrationSearchDTO), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/labregistration/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody LabRegistrationDTO labRegistrationDTO) {
		return new ResponseEntity<>( labRegistrationService.save(labRegistrationDTO), HttpStatus.OK);
	}

	@PutMapping(value = "/labregistration/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody LabRegistrationDTO labRegistrationDTO) {
		return new ResponseEntity<>( labRegistrationService.update(labRegistrationDTO), HttpStatus.OK);
	}


	@PutMapping(value = "/labregistration/updatestatus")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> updateStatus(@RequestBody LabRegistrationStatusDTO labRegistrationStatusDTO) {
		return new ResponseEntity<>( labRegistrationService.updateStatus(labRegistrationStatusDTO), HttpStatus.OK);
	}
}
