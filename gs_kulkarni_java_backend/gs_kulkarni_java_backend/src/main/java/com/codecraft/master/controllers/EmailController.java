package com.codecraft.master.controllers;

import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.services.impl.EmailAttachmentSender;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RequestMapping("/mastermanager")
@Slf4j
public class EmailController {


	@PostMapping(value = "/email/send")
	@Operation(security = @SecurityRequirement(name = "bearerAuth"))
	public ResponseEntity<MasterManagerResponse> sendEmail(@RequestPart("file") MultipartFile file, @RequestParam(name= "subject", required=false) String subject, @RequestParam(name ="message", required=false) String message ) {


		String host = "smtp.gmail.com";
		String port = "587";
		String mailFrom = "healthdetails760@gmail.com";
		String password = "hqgg lczb rvwq lzkg";

		List<String> mailToList = new ArrayList<>();
		// message info
		String mailTo = "healthdetails760@gmail.com";

		if(StringUtils.isEmpty(subject)) { subject = file.getOriginalFilename();}
		if(StringUtils.isEmpty(message)) { message = "I have some attachments for you."; }

		// attachments

		//String[] attachFiles = new String[0];
/*		attachFiles[0] = "e:/Test/Picture.png";
		attachFiles[1] = "e:/Test/Music.mp3";
		attachFiles[2] = "e:/Test/Video.mp4";
*/
		try {
			EmailAttachmentSender.sendEmailWithAttachments(host, port, mailFrom, password, mailToList,
					subject, message, file);
			System.out.println("Email sent.");
			return new ResponseEntity<>( new MasterManagerResponse("SUCCESS"), HttpStatus.OK);

		} catch (Exception ex) {
			System.out.println("Could not send email.");
			ex.printStackTrace();
			return new ResponseEntity<>( new MasterManagerResponse("FAILED"), HttpStatus.INTERNAL_SERVER_ERROR);

		}

	}
}
