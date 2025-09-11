
package com.codecraft.master.mappers;

import com.codecraft.master.entities.PayoutDetails;
import com.codecraft.master.models.PayoutDetailsDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class PayoutDetailsMapper {

    public abstract PayoutDetailsDTO payoutDetailsToPayoutDetailsDTO(PayoutDetails source);

    public abstract PayoutDetails payoutDetailsDTOToPayoutDetails(PayoutDetailsDTO source);
}