package com.codecraft.master.controllers;


import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.PathologyTestDetails;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.PathologyTestDetailsService;
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
public class PathologyTestDetailsController {

	@Autowired
	PathologyTestDetailsService pathologyTestsService;

	@PostMapping(value = "/pathologytestdetails/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody PathologyTestDetails pathologyTests) {
		if (Objects.nonNull(pathologyTests)) {
			return new ResponseEntity<>(pathologyTestsService.search(pathologyTests),HttpStatus.OK);
		} else {
		  throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/pathologytestdetails/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody PathologyTestDetails pathologyTests) {
			 return new ResponseEntity<>(pathologyTestsService.save(pathologyTests),HttpStatus.OK);
	}

	@DeleteMapping(value = "/pathologytestdetails/{id}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> deleteById(@PathVariable Integer id) {
		return new ResponseEntity<>(pathologyTestsService.deleteById(id),HttpStatus.OK);
	}


}
