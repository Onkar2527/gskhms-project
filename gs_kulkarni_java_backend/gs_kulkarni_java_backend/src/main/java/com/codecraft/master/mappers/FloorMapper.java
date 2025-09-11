
package com.codecraft.master.mappers;

import com.codecraft.master.entities.Floor;
import com.codecraft.master.models.FloorDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class FloorMapper {

    public abstract FloorDTO floorToFloorDTO(Floor source);

    public abstract Floor floorDTOToFloor(FloorDTO source);
}