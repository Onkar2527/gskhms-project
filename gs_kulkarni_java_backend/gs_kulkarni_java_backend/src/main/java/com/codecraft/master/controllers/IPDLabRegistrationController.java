package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.AppointmentServiceEntity;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.IPDLabRegister;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.AppointmentServicesService;
import com.codecraft.master.services.impl.IPDLabRegisterService;
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
public class IPDLabRegistrationController {

	@Autowired
	IPDLabRegisterService ipdLabRegisterService;

	@PostMapping(value = "/ipdlab-register/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody AppointmentServiceEntity appointmentServiceEntity) {
		if (Objects.nonNull(appointmentServiceEntity)) {
			return new ResponseEntity<>(ipdLabRegisterService.search(appointmentServiceEntity), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/ipdlab-register/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody IPDLabRegister appointmentServiceEntity) {
		return new ResponseEntity<>( ipdLabRegisterService.save(appointmentServiceEntity), HttpStatus.OK);
	}


}
