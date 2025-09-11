package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.ServiceRate;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.ServiceRateService;
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
public class ServiceRateController {


	@Autowired
	ServiceRateService serviceRateService;

	@PostMapping(value = "/serviceRate/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody ServiceRate serviceRate) {
		if (Objects.nonNull(serviceRate)) {
			return new ResponseEntity<>(serviceRateService.search(serviceRate), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/serviceRate/search/charge")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> searchCharge(@RequestBody ServiceRate serviceRate) {
		log.info("ServiceRateController : search() starting Request Object : {}", serviceRate);
		if (Objects.nonNull(serviceRate)) {
			return new ResponseEntity<>(serviceRateService.searchCharge(serviceRate), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/serviceRate/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody ServiceRate ServiceRate) {
			return new ResponseEntity<>(serviceRateService.save(ServiceRate), HttpStatus.OK);
	}
	
	@PutMapping(value = "/serviceRate/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody ServiceRate ServiceRate) {
			return new ResponseEntity<>(serviceRateService.update(ServiceRate), HttpStatus.OK);
	}
	
}
