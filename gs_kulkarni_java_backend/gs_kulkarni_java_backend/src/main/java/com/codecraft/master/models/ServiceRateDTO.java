package com.codecraft.master.models;


import com.codecraft.master.audit.Auditable;
import com.codecraft.master.entities.ServiceRateId;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
public class ServiceRateDTO {
	private Integer employeeId;

	private Integer serviceId;

	private String serviceName;

	private Date startDate;

	private Date createTimestamp;

	private double serviceRate;

	private Integer hospitalId;

	private double oldServiceRate;
	
}