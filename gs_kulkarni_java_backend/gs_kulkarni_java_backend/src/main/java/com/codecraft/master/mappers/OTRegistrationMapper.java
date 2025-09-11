
package com.codecraft.master.mappers;

import com.codecraft.master.entities.OTRegistration;
import com.codecraft.master.models.OTRegistrationDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class OTRegistrationMapper {

    public abstract OTRegistrationDTO otRegistrationToOTRegistrationDTO(OTRegistration source);

    public abstract OTRegistration otRegistrationDTOToOTRegistration(OTRegistrationDTO source);
}