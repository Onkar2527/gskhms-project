package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.BedFacility;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.BedFacilityService;
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
public class BedFacilityController {

	@Autowired
	BedFacilityService bedFacilityService;

	@PostMapping(value = "/bed-facility/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody BedFacility bedFacility) {
		if (Objects.nonNull(bedFacility)) {
			return new ResponseEntity<>(bedFacilityService.search(bedFacility), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/bed-facility/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody BedFacility bedFacility) {
		return new ResponseEntity<>( bedFacilityService.save(bedFacility), HttpStatus.OK);
	}

	@PutMapping(value = "/bed-facility/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody BedFacility bedFacility) {
		return new ResponseEntity<>( bedFacilityService.update(bedFacility), HttpStatus.OK);
	}

	@DeleteMapping(value = "/bed-facility/{id}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> deleteById(@PathVariable Integer id) {
		return new ResponseEntity<>( bedFacilityService.deleteById(id), HttpStatus.OK);
	}

	@DeleteMapping(value = "/bed-facility/{appointmentId}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> deleteByAppointmentId(@PathVariable Integer appointmentId) {
		return new ResponseEntity<>( bedFacilityService.deleteByAppointmentId(appointmentId), HttpStatus.OK);
	}
}
