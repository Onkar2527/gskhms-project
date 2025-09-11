package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.BillingClass;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.BillingClassService;
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
public class BillingClassController {

	@Autowired
	BillingClassService billingClassService;

	@PostMapping(value = "/billing-class/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody BillingClass billingClass) {
		if (Objects.nonNull(billingClass)) {
			return new ResponseEntity<>(billingClassService.search(billingClass), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/billing-class/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody BillingClass billingClass) {
		return new ResponseEntity<>( billingClassService.save(billingClass), HttpStatus.OK);
	}

	@PutMapping(value = "/billing-class/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody BillingClass billingClass) {
		return new ResponseEntity<>( billingClassService.update(billingClass), HttpStatus.OK);
	}

	@DeleteMapping(value = "/billing-class/delete")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> delete(@PathVariable Integer id) {
		return new ResponseEntity<>( billingClassService.delete(id), HttpStatus.OK);
	}
}
