package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Organisation;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.OrganisationService;
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
public class OrganisationController {

    @Autowired
    OrganisationService organisationService;

    @PostMapping(value = "/patCompany/search")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> search(@RequestBody Organisation organisation) {
        if (Objects.nonNull(organisation)) {
            return new ResponseEntity<>(organisationService.search(organisation), HttpStatus.OK);
        } else {
            throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/patCompany/save")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> save(@RequestBody Organisation organisation) {
        return new ResponseEntity<>( organisationService.save(organisation), HttpStatus.OK);
    }

    @PutMapping(value = "/patCompany/update")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> update(@RequestBody Organisation organisation) {
        return new ResponseEntity<>( organisationService.update(organisation), HttpStatus.OK);
    }
}

