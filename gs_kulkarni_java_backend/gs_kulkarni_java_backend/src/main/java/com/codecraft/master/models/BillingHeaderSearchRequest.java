package com.codecraft.master.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillingHeaderSearchRequest {
    private Date billingDate;
    private Date billingStartDate;
    private Date billingEndDate;
    private Integer appointmentId;

}

