package com.codecraft.master.controllers;


import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.NoteTemplate;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.NoteTemplateService;
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
public class NoteTemplateController {

	@Autowired
	NoteTemplateService noteTemplateService;

	@PostMapping(value = "/notetemplate/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody NoteTemplate noteTemplate) {
		if (Objects.nonNull(noteTemplate)) {
			return new ResponseEntity<>(noteTemplateService.search(noteTemplate),HttpStatus.OK);
		} else {
		  throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/notetemplate/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody NoteTemplate noteTemplate) {
			 return new ResponseEntity<>(noteTemplateService.save(noteTemplate),HttpStatus.OK);
	}

	@PutMapping(value = "/notetemplate/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestBody NoteTemplate noteTemplate) {
		return new ResponseEntity<>(noteTemplateService.save(noteTemplate),HttpStatus.OK);
	}
}
