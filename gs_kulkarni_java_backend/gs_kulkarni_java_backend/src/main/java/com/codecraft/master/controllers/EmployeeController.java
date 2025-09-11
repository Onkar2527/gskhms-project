package com.codecraft.master.controllers;


import com.codecraft.master.entities.Employee;
import com.codecraft.master.models.EmployeeDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/mastermanager")
@Slf4j
public class EmployeeController {


	@Autowired
	UserService userService;

	@PostMapping(value = "/user/search")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> search(@RequestBody Employee employee) {
		return new ResponseEntity<>(userService.search(employee), HttpStatus.OK);
	}

	@PostMapping(value = "/user/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestBody Employee employee) {
		return new ResponseEntity<>(userService.save(employee), HttpStatus.OK);
	}

	@PostMapping(value = "/user/saveData")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> save(@RequestParam("user") String user,  @RequestParam( value = "file", required = false) MultipartFile file) {
		return new ResponseEntity<>(userService.save(user, file), HttpStatus.OK);
	}
	
	@PutMapping(value = "/user/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> update(@RequestParam("user") String user,  @RequestParam( value = "file", required = false) MultipartFile file) {
		 return new ResponseEntity<>(userService.update(user, file), HttpStatus.OK);
	}

	@DeleteMapping(value = "/user/delete")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> delete(@QueryParam(value = "userId") String userId) {
		 return new ResponseEntity<>(userService.delete(userId), HttpStatus.OK);
	}

	@GetMapping(value = "/user/validateUser")
	public ResponseEntity<MasterManagerResponse> validateUser(@QueryParam(value = "email") String email,
			@QueryParam(value = "password") String password) {
		return new ResponseEntity<>(userService.validateUser(email, password), HttpStatus.OK);
	}

	@GetMapping(value = "/user/currentLoggedInUsers")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> getCurrentLoggedInUsers(@QueryParam(value = "compId") Integer compId) {
		return new ResponseEntity<>(userService.getCurrentLoggedInUsers(compId), HttpStatus.OK);
	}

	@PutMapping(value = "/user/updatePassword/{employeeId}")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> updatePassword(@PathVariable Integer employeeId,
			@RequestBody Employee employee) {
		return new ResponseEntity<>(userService.updatePassword(employeeId, employee), HttpStatus.OK);
	}

	@PutMapping(value = "/user/updatePassword")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> updatePasswordByEmail(@RequestBody Employee employee) {
		return new ResponseEntity<>(userService.updatePasswordByEmailId(employee), HttpStatus.OK);
	}

	@PostMapping(value = "/doctor/save")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> doctorSave(@RequestBody EmployeeDTO doctorDTO) {
		return new ResponseEntity<>(userService.doctorSave(doctorDTO), HttpStatus.OK);
	}

	@PutMapping(value = "/doctor/update")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> doctorUpdate(@RequestBody EmployeeDTO doctorDTO) {
		return new ResponseEntity<>(userService.doctorUpdate(doctorDTO), HttpStatus.OK);
	}
}
