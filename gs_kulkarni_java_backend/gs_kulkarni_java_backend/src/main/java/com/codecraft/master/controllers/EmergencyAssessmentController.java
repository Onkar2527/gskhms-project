package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.EmergencyAssessmentDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.EmergencyAssessmentService;
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
public class EmergencyAssessmentController {

	@Autowired
	EmergencyAssessmentService emergencyAssessmentService;

	@PostMapping(value = "/emergency-assessment/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody EmergencyAssessmentDTO emergencyAssessmentDTO) {
		if (Objects.nonNull(emergencyAssessmentDTO)) {
			return new ResponseEntity<>(emergencyAssessmentService.search(emergencyAssessmentDTO), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/emergency-assessment/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody EmergencyAssessmentDTO emergencyAssessmentDTO) {
		return new ResponseEntity<>( emergencyAssessmentService.save(emergencyAssessmentDTO), HttpStatus.OK);
	}

	@PutMapping(value = "/emergency-assessment/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody EmergencyAssessmentDTO emergencyAssessmentDTO) {
		return new ResponseEntity<>( emergencyAssessmentService.update(emergencyAssessmentDTO), HttpStatus.OK);
	}
}
