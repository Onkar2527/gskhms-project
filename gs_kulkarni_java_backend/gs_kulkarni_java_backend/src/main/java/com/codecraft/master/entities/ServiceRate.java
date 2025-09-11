package com.codecraft.master.entities;


import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
@Getter
@Setter
@Entity
@Table(name = "service_rate")
@ToString
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ServiceRateId.class)
public class ServiceRate  extends Auditable {
	@Id
	@Column(name = "employee_id")
	private Integer employeeId;

	@Id
	@Column(name = "service_id")
	private Integer serviceId;

	@Id
	@Column(name = "start_date")
	private Date startDate;

	@Column(name = "created_timestamp")
	private Date createTimestamp;

	@Column(name = "rate")
	private double serviceRate;

	@Column(name = "hospital_id")
	private Integer hospitalId;

	@Column(name = "old_service_rate")
	private double oldServiceRate;
	
}