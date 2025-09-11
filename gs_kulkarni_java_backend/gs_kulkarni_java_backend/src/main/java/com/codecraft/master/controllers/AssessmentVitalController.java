package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.AssessmentVitalDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.AssessmentVitalService;
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
public class AssessmentVitalController {

	@Autowired
	AssessmentVitalService assessmentVitalService;

	@PostMapping(value = "/assessment-vital/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody AssessmentVitalDTO assessmentVitalDTO) {
		if (Objects.nonNull(assessmentVitalDTO)) {
			return new ResponseEntity<>(assessmentVitalService.search(assessmentVitalDTO), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/assessment-vital/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody AssessmentVitalDTO assessmentVitalDTO) {
		return new ResponseEntity<>( assessmentVitalService.save(assessmentVitalDTO), HttpStatus.OK);
	}

	@PutMapping(value = "/assessment-vital/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody AssessmentVitalDTO assessmentVitalDTO) {
		return new ResponseEntity<>( assessmentVitalService.update(assessmentVitalDTO), HttpStatus.OK);
	}
}
