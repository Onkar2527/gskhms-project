package com.codecraft.master.mappers;

import com.codecraft.master.entities.Organisation;
import com.codecraft.master.models.OrganisationDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class OrganisationMapper {

    public abstract OrganisationDTO organisationToOrganisationDTO(Organisation source);
    public abstract Organisation organisationDTOToOrganisation(OrganisationDTO source);
}
