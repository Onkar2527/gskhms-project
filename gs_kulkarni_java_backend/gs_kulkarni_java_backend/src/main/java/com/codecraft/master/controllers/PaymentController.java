package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Payment;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PaymentSearchRequest;
import com.codecraft.master.models.PaymentDTO;
import com.codecraft.master.services.impl.PaymentService;
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
public class PaymentController {

	@Autowired
	PaymentService paymentService;

	@PostMapping(value = "/payment/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody PaymentSearchRequest payment) {
		if (Objects.nonNull(payment)) {
			return new ResponseEntity<>( paymentService.search(payment), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/payment/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody PaymentDTO payment) {
		return new ResponseEntity<>( paymentService.save(payment), HttpStatus.OK);
	}

	@PostMapping(value = "/payment/save-ipd")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> saveIPD(@RequestBody PaymentDTO payment) {
		return new ResponseEntity<>( paymentService.saveIPDPayment(payment), HttpStatus.OK);
	}

	@PutMapping(value = "/payment/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody Payment payment) {
		return new ResponseEntity<>( paymentService.update(payment), HttpStatus.OK);
	}
	
}
