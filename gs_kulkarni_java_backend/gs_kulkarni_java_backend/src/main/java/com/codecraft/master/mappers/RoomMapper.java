
package com.codecraft.master.mappers;

import com.codecraft.master.entities.Bed;
import com.codecraft.master.entities.Room;
import com.codecraft.master.models.BedDTO;
import com.codecraft.master.models.RoomDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class RoomMapper {

    public abstract RoomDTO roomToRoomDTO(Room source);

    public abstract Room roomDTOToRoom(RoomDTO source);
}