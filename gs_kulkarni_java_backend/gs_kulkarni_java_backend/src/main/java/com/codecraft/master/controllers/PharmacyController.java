package com.codecraft.master.controllers;


import com.codecraft.master.entities.Pharmacy;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.PharmacyService;

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
public class PharmacyController {


	@Autowired
	PharmacyService pharmacyService;

	@GetMapping(value = "/pharmacy/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search() {
		return new ResponseEntity<>(pharmacyService.search(), HttpStatus.OK);
	}

	@PostMapping(value = "/pharmacy/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody Pharmacy pharmacy) {
		return  new ResponseEntity<>(pharmacyService.save(pharmacy), HttpStatus.OK);
	}

}
