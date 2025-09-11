package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.BillingHeader;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.BillingHeaderSearchRequest;
import com.codecraft.master.services.impl.BillService;
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
public class BillController {

	@Autowired
	BillService billService;

	@PostMapping(value = "/bill/{billingId}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> getBill(@PathVariable  Integer billingId) {
		if (Objects.nonNull(billingId)) {
			return new ResponseEntity<>( billService.getBill(billingId), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}


	@PostMapping(value = "/bill/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody BillingHeader billingHeader) {
		return new ResponseEntity<>( billService.save(billingHeader), HttpStatus.OK);
	}


	@PostMapping(value = "/bill/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody BillingHeaderSearchRequest billingHeader) {

		return new ResponseEntity<>( billService.search(billingHeader), HttpStatus.OK);
	}

	@GetMapping(value = "/bill/today")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> searchToday() {
		return new ResponseEntity<>( billService.searchToday(), HttpStatus.OK);
	}

	@GetMapping(value = "/bill/past")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> searchPast() {
		return new ResponseEntity<>( billService.searchPast(), HttpStatus.OK);
	}
	
}
