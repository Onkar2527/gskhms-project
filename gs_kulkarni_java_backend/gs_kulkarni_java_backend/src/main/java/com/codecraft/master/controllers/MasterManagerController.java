package com.codecraft.master.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mastermanager")
@CrossOrigin
@Produces(MediaType.APPLICATION_JSON)
@Slf4j
public class MasterManagerController {

	@GetMapping(value = "/appStatus")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<String> appStatue() {
		return new ResponseEntity<>("Running.....", HttpStatus.OK);
	}
}
