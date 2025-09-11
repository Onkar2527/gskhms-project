package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.*;
import com.codecraft.master.services.impl.DashboardService;
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

import java.text.ParseException;
import java.util.Objects;

@RestController
@CrossOrigin
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/mastermanager")
@Slf4j
public class DashboardController {

	@Autowired
	DashboardService service;

	@PostMapping(value = "/dashboard/reception")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> receptionDashboard(@RequestBody ReceptionDashboardRequest receptionDashboardRequest) throws ParseException {
		if (Objects.nonNull(receptionDashboardRequest)) {
			return new ResponseEntity<>( service.getReceptionDashboard(receptionDashboardRequest), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/dashboard/admin")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> adminDashboard(@RequestBody AdminDashboardRequest adminDashboardRequest) {
		if (Objects.nonNull(adminDashboardRequest)) {
			return new ResponseEntity<>( service.getAdminDashboard(adminDashboardRequest), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/dashboard/doctor")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> doctorDashboard(@RequestBody DoctorDashboardRequest doctorDashboardRequest) {
		if (Objects.nonNull(doctorDashboardRequest)) {
			return new ResponseEntity<>( service.getDoctorDashboard(doctorDashboardRequest), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/dashboard/account")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> billingDashboard(@RequestBody BillingDashboardRequest billingDashboardRequest) {
		if (Objects.nonNull(billingDashboardRequest)) {
			return new ResponseEntity<>( service.getBillingDashboard(billingDashboardRequest), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/dashboard/lab")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> labDashboard(@RequestBody LabDashboardRequest labDashboardRequest) {
		if (Objects.nonNull(labDashboardRequest)) {
			return new ResponseEntity<>( service.getLabDashboard(labDashboardRequest), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/dashboard/nurse")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> labDashboard(@RequestBody NurseDashboardRequest nurseDashboardRequest) {
		if (Objects.nonNull(nurseDashboardRequest)) {
			return new ResponseEntity<>( service.getNurseDashboard(nurseDashboardRequest), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

}
