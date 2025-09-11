
package com.codecraft.master.mappers;

import com.codecraft.master.entities.Payment;
import com.codecraft.master.models.PaymentDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class PaymentMapper {

    public abstract PaymentDTO paymentToPaymentDTO(Payment source);

    public abstract Payment paymentDTOToPayment(PaymentDTO source);
}