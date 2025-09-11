package com.codecraft.master.models;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class BillingDetailsDTO {

	private Integer id;

	private Integer billingId;

	private Integer serviceId;

	private String description;

	private String paymentNumber;

	private String serviceName;

	private Double amount;

	private String paymentStatus;

}