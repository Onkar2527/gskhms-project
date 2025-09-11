package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.AppointmentBedAssign;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.AppointmentBedAssignService;
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
public class AppointmentBedAssignController {

	@Autowired
	AppointmentBedAssignService appointmentBedAssignService;

	@PostMapping(value = "/appointmentbedassign/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody AppointmentBedAssign appointmentBedAssign) {
		if (Objects.nonNull(appointmentBedAssign)) {
			return new ResponseEntity<>(appointmentBedAssignService.search(appointmentBedAssign), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/appointmentbedassign/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody AppointmentBedAssign bed) {
		return new ResponseEntity<>( appointmentBedAssignService.save(bed), HttpStatus.OK);
	}

	@PutMapping(value = "/appointmentbedassign/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody AppointmentBedAssign bed) {
		return new ResponseEntity<>( appointmentBedAssignService.update(bed), HttpStatus.OK);
	}

	@DeleteMapping(value = "/appointmentbedassign/delete/{id}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> delete(@PathVariable Integer id) {
		return new ResponseEntity<>( appointmentBedAssignService.deleteById(id), HttpStatus.OK);
	}

	@DeleteMapping(value = "/appointmentbedassign/delete/{appointmentId}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> deleteByAppointmentId(@PathVariable Integer appointmentId) {
		return new ResponseEntity<>( appointmentBedAssignService.deleteByAppointmentId(appointmentId), HttpStatus.OK);
	}

	@GetMapping(value = "/appointmentbedassign/release/{bedId}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> releaseBedByBedId(@PathVariable Integer bedId) {
		return new ResponseEntity<>( appointmentBedAssignService.releaseBedAndCalculateBill(bedId), HttpStatus.OK);
	}

}
