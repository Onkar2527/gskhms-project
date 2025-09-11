package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Appointment;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.AppointmentDTO;
import com.codecraft.master.models.AppointmentSearchRequest;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.AppointmentService;
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
public class AppointmentController {

	@Autowired
	AppointmentService appointmentService;

	@PostMapping(value = "/appointment/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody AppointmentSearchRequest appointment) {
		if (Objects.nonNull(appointment)) {
			return new ResponseEntity<>( appointmentService.search(appointment), HttpStatus.OK);
		} else {
			log.info("AppointmentController : search() empty body received");
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/appointment/past")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> searchPast(@RequestBody AppointmentSearchRequest appointment) {
		if (Objects.nonNull(appointment)) {
			return new ResponseEntity<>( appointmentService.searchPast(appointment), HttpStatus.OK);
		} else {
			log.info("AppointmentController : search() empty body received");
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/appointment/future")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> searchFuture(@RequestBody AppointmentSearchRequest appointment) {
		if (Objects.nonNull(appointment)) {
			return new ResponseEntity<>( appointmentService.searchFuture(appointment), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/appointment/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody AppointmentDTO appointmentDTO) {
		return new ResponseEntity<>( appointmentService.save(appointmentDTO), HttpStatus.OK);
	}
	
	@PutMapping(value = "/appointment/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody AppointmentDTO appointment) {
		return new ResponseEntity<>( appointmentService.update(appointment), HttpStatus.OK);
	}
	
}
