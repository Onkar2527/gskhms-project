package com.codecraft.master.exceptions;

import com.codecraft.master.constant.MasterConstant;
import org.springframework.http.HttpStatus;

public class MasterManagerException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	private String errorMessage = MasterConstant.SYSTEM_ERROR_MSG;
	private HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

	public MasterManagerException() {

	}

	public MasterManagerException(String errorMessage, HttpStatus status) {
		super(errorMessage);
		this.errorMessage = errorMessage;
		this.status = status;
	}

	public MasterManagerException(String message) {
		super(message);
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public void setStatus(HttpStatus status) {
		this.status = status;
	}
	
	
}