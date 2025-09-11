package com.codecraft.master.models;

public class MasterManagerResponse {

	private String message;
	private Object data;

	public MasterManagerResponse(String message, Object data) {
		super();
		this.message = message;
		this.data = data;
	}

	public MasterManagerResponse(String message) {
		super();
		this.message = message;
	}

	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("TaskManagerResponse [message=");
		builder.append(message);
		builder.append(", data=");
		builder.append(data);
		builder.append("]");
		return builder.toString();
	}

}
