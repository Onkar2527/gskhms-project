package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.ClinicalAssessment;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.ClinicalAssessmentDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.ClinicalAssessmentService;
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
public class ClinicalAssessmentController {

	@Autowired
	ClinicalAssessmentService clinicalAssessmentService;

	@PostMapping(value = "/clinical-assessment/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody ClinicalAssessmentDTO clinicalAssessmentDTO) {
		if (Objects.nonNull(clinicalAssessmentDTO)) {
			return new ResponseEntity<>(clinicalAssessmentService.search(clinicalAssessmentDTO), HttpStatus.OK);
		} else {
			throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/clinical-assessment/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody ClinicalAssessmentDTO clinicalAssessmentDTO) {
		return new ResponseEntity<>( clinicalAssessmentService.save(clinicalAssessmentDTO), HttpStatus.OK);
	}

	@PutMapping(value = "/clinical-assessment/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody ClinicalAssessmentDTO clinicalAssessmentDTO) {
		return new ResponseEntity<>( clinicalAssessmentService.update(clinicalAssessmentDTO), HttpStatus.OK);
	}
}
