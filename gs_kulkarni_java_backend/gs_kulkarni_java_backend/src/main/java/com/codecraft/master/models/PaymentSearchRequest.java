package com.codecraft.master.models;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSearchRequest {

    private Integer billingId;

    private String paymentStatus;

    private Date paymentDate;

    private Date paymentStartDate;
    private Date paymentEndDate;

    private Boolean isServicePayment;
    private Integer appointmentId;
    private String firstName;
    private String lastName;
    private String type;

}

