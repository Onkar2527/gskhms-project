package com.codecraft.master.models;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ContinuationSheetDTO {

	private Integer id;

	private Date noteTime;

	private Integer appointmentId;

	private String clinicalNotes;

	private String advise;

	private Integer hospitalId;

	private String namePrefix;
	private String firstName;
	private String middleName;
	private String lastName;
	private String fatherName;
	private Date dob;
	private String gender;
	private String maritalStatus;
	private String mobileNumber;

	private String patientUHIDNumber;
	private String appointmentNumber;
	
}