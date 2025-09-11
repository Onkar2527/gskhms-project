
package com.codecraft.master.mappers;

import com.codecraft.master.entities.Bed;
import com.codecraft.master.models.BedDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class BedMapper {

    public abstract BedDTO bedToBedDTO(Bed source);

    public abstract Bed bedDTOToBed(BedDTO source);
}