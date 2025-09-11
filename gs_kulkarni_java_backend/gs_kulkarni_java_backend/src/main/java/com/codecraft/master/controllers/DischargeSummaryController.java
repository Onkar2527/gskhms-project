package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.DischargeSummary;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.DischargeSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
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
public class DischargeSummaryController {

	@Autowired
	DischargeSummaryService service;

	@PostMapping(value = "/discharge-summary/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody DischargeSummary dischargeSummary) {
		if (Objects.nonNull(dischargeSummary)) {
			return new ResponseEntity<>(service.search(dischargeSummary), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/discharge-summary/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody DischargeSummary dischargeSummary) {
			return new ResponseEntity<>(service.save(dischargeSummary),HttpStatus.OK);
	}
	
	@PutMapping(value = "/discharge-summary/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody DischargeSummary dischargeSummary) {
			return new ResponseEntity<>(service.update(dischargeSummary),HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/discharge-summary/delete")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> delete(@QueryParam(value = "id") Integer id) {
			return new ResponseEntity<>(service.delete(id),HttpStatus.OK);
	}
}