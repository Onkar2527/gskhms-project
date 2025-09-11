package com.codecraft.master.controllers;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.PrescriptionDetailsAfter;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PrescriptionDetailsSearchRequestAfter;
import com.codecraft.master.services.impl.PrescriptionDetailsAfterService;
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
public class PrescriptionDetailsControllerAfter {

    @Autowired
    PrescriptionDetailsAfterService prescriptionDetailsAfterService;

    @PostMapping(value = "/prescriptionAfter/search")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> search(@RequestBody PrescriptionDetailsSearchRequestAfter prescriptionDetails) {
        if (Objects.nonNull(prescriptionDetails)) {
            return new ResponseEntity<>(prescriptionDetailsAfterService.search(prescriptionDetails), HttpStatus.OK);
        } else {
            throw new MasterManagerException(MasterConstant.EMPTY_BODY, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/prescriptionAfter/save")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> save(@RequestBody PrescriptionDetailsAfter prescriptionDetails) {
        return new ResponseEntity<>(prescriptionDetailsAfterService.save(prescriptionDetails), HttpStatus.OK);
    }

    @PostMapping(value = "/prescriptionAfter/save-all")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> saveAll(@RequestBody List<PrescriptionDetailsAfter> prescriptionDetails) {
        return new ResponseEntity<>(prescriptionDetailsAfterService.saveAll(prescriptionDetails), HttpStatus.OK);
    }

    @PutMapping(value = "/prescriptionAfter/update")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> update(@RequestBody PrescriptionDetailsAfter prescriptionDetails) {
        return new ResponseEntity<>(prescriptionDetailsAfterService.update(prescriptionDetails), HttpStatus.OK);
    }

    @DeleteMapping(value = "/prescriptionAfter/{id}")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MasterManagerResponse> delete(@PathVariable Integer id) {
        return new ResponseEntity<>( prescriptionDetailsAfterService.delete(id), HttpStatus.OK);
    }



}
