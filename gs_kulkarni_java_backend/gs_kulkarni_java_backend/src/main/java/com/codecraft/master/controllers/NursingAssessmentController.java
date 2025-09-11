package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.NursingAssessmentDTO;
import com.codecraft.master.services.impl.NursingAssessmentService;
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
public class NursingAssessmentController {

	@Autowired
	NursingAssessmentService nursingAssessmentService;

	@PostMapping(value = "/nursing-assessment/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody NursingAssessmentDTO nursingAssessmentDTO) {
		if (Objects.nonNull(nursingAssessmentDTO)) {
			return new ResponseEntity<>(nursingAssessmentService.search(nursingAssessmentDTO), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/nursing-assessment/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody NursingAssessmentDTO nursingAssessmentDTO) {
		return new ResponseEntity<>( nursingAssessmentService.save(nursingAssessmentDTO), HttpStatus.OK);
	}

	@PutMapping(value = "/nursing-assessment/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody NursingAssessmentDTO nursingAssessmentDTO) {
		return new ResponseEntity<>( nursingAssessmentService.update(nursingAssessmentDTO), HttpStatus.OK);
	}
}
