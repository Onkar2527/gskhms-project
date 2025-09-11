package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.PrescriptionDetails;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PrescriptionDetailsSearchRequest;
import com.codecraft.master.services.impl.PrescriptionDetailsService;
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

import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/mastermanager")
@Slf4j
public class PrescriptionDetailsController {

    @Autowired
    PrescriptionDetailsService prescriptionDetailsService;

    @PostMapping(value = "/prescription/search")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> search(@RequestBody PrescriptionDetailsSearchRequest prescriptionDetails) {
        if (Objects.nonNull(prescriptionDetails)) {
            return new ResponseEntity<>(prescriptionDetailsService.search(prescriptionDetails), HttpStatus.OK);
        } else {
            throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/prescription/save")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> save(@RequestBody PrescriptionDetails prescriptionDetails) {
        return new ResponseEntity<>(prescriptionDetailsService.save(prescriptionDetails), HttpStatus.OK);
    }

    @PostMapping(value = "/prescription/save-all")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> saveAll(@RequestBody List<PrescriptionDetails> prescriptionDetails) {
        return new ResponseEntity<>(prescriptionDetailsService.saveAll(prescriptionDetails), HttpStatus.OK);
    }

    @PutMapping(value = "/prescription/update")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> update(@RequestBody PrescriptionDetails prescriptionDetails) {
        return new ResponseEntity<>(prescriptionDetailsService.update(prescriptionDetails), HttpStatus.OK);
    }

    @DeleteMapping(value = "/prescription/{id}")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> delete(@PathVariable Integer id) {
        return new ResponseEntity<>( prescriptionDetailsService.delete(id), HttpStatus.OK);
    }



}
