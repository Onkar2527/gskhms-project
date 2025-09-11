
package com.codecraft.master.mappers;

import com.codecraft.master.entities.RoomType;
import com.codecraft.master.models.RoomTypeDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class RoomTypeMapper {

    public abstract RoomTypeDTO roomTypeToRoomTypeDTO(RoomType source);

    public abstract RoomType roomTypeDTOToRoomType(RoomTypeDTO source);
}