package com.codecraft.master.controllers;

import com.codecraft.master.models.HospitalInfraDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.HospitalInfraService;
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

@RestController
@CrossOrigin
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/mastermanager")
@Slf4j
public class HospitalInfraController {

	@Autowired
	HospitalInfraService hospitalInfraService;

	@GetMapping(value = "/hospital-infra")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> get() {
			return new ResponseEntity<>(hospitalInfraService.get(), HttpStatus.OK);
	}

	@GetMapping(value = "/hospital-infra/{doctorid}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> get(@PathVariable Integer doctorid) {
		return new ResponseEntity<>(hospitalInfraService.get(doctorid), HttpStatus.OK);
	}
	
	@PostMapping(value = "/hospital-infra/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody HospitalInfraDTO hospitalInfraDTO) {
		return new ResponseEntity<>( hospitalInfraService.save(hospitalInfraDTO), HttpStatus.OK);
	}

	@PutMapping(value = "/hospital-infra/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody HospitalInfraDTO hospitalInfraDTO) {
		return new ResponseEntity<>( hospitalInfraService.update(hospitalInfraDTO), HttpStatus.OK);
	}
}
