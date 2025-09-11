
package com.codecraft.master.mappers;

import com.codecraft.master.entities.BillingHeader;
import com.codecraft.master.models.BillingHeaderDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class BillingHeaderMapper {

    public abstract BillingHeaderDTO billingHeaderToBillingHeaderDTO(BillingHeader source);
}
