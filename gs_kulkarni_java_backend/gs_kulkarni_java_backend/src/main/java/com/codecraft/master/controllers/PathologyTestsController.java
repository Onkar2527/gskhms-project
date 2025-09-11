package com.codecraft.master.controllers;


import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.PathologyTests;
import com.codecraft.master.entities.Quantity;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.PathologyTestsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PathParam;
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
public class PathologyTestsController {

	@Autowired
	PathologyTestsService pathologyTestsService;

	@PostMapping(value = "/pathologytests/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody PathologyTests pathologyTests) {
		if (Objects.nonNull(pathologyTests)) {
			return new ResponseEntity<>(pathologyTestsService.search(pathologyTests),HttpStatus.OK);
		} else {
		  throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping(value = "/pathologytests/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody PathologyTests pathologyTests) {
			 return new ResponseEntity<>(pathologyTestsService.save(pathologyTests),HttpStatus.OK);
	}

	@PutMapping(value = "/pathologytests/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody PathologyTests pathologyTests) {
		return new ResponseEntity<>(pathologyTestsService.update(pathologyTests),HttpStatus.OK);
	}
	@DeleteMapping(value = "/pathologytests/{id}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> deleteById(@PathVariable Integer id) {
		return new ResponseEntity<>(pathologyTestsService.deleteById(id),HttpStatus.OK);
	}

	
}
