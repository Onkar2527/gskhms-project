package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Floor;
import com.codecraft.master.entities.Room;
import com.codecraft.master.entities.RoomType;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.RoomMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.RoomDTO;
import com.codecraft.master.repositories.FloorRepository;
import com.codecraft.master.repositories.RoomRepository;
import com.codecraft.master.repositories.RoomTypeRepository;
import com.codecraft.master.specifications.RoomSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class RoomService {

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    FloorRepository floorRepository;

    @Autowired
    RoomTypeRepository roomTypeRepository;

    @Autowired
    RoomMapper roomMapper;

    public MasterManagerResponse search(Room reqDomain) {
        log.info("RoomService : search() started reqDomain {}", reqDomain);
        try {
            Specification<Room> spec = Specification.where(RoomSpecification.withHospitalId(UserContext.getHospitalId()));
            spec = spec.and(Specification.where(RoomSpecification.withIsActive(1)));

            if(Objects.nonNull(reqDomain.getFloorId())){
                spec = spec.and(Specification.where(RoomSpecification.withFloorId(reqDomain.getFloorId())));
            }

            List<Room> roomDetails = roomRepository.findAll(spec);

            List<RoomDTO> roomDTOList = new ArrayList<>();
            roomDetails.forEach(room -> {
                roomDTOList.add(getRoomDTO(room));
            });

            return new MasterManagerResponse(MasterConstant.SUCCESS, roomDTOList);
        } catch (Exception e) {
            log.error("BedService : search() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private RoomDTO getRoomDTO(Room room) {
        RoomDTO roomDTO = roomMapper.roomToRoomDTO(room);
        if (Objects.nonNull(roomDTO.getRoomTypeId())) {
            Optional<RoomType> roomTypeOptional = roomTypeRepository.findById(roomDTO.getRoomTypeId());
            roomTypeOptional.ifPresent(roomType -> roomDTO.setRoomTypeName(roomType.getName()));
        }
        if (Objects.nonNull(roomDTO.getFloorId())) {
            Optional<Floor> floorOptional = floorRepository.findById(roomDTO.getFloorId());
            floorOptional.ifPresent(floor -> roomDTO.setFloorName(floor.getName()));
        }
        return roomDTO;
    }

    @Transactional
    public MasterManagerResponse save(Room reqDomain) {
        log.info("RoomService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getStatus())){
                reqDomain.setStatus("A");
            }
            reqDomain = roomRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getRoomDTO(reqDomain));
        } catch (Exception e) {
            log.error("BedService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(Room reqDomain) {
        log.info("RoomService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getStatus())){
                reqDomain.setStatus("A");
            }
            reqDomain = roomRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED,getRoomDTO(reqDomain));
        } catch (Exception e) {
            log.error("RoomService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        log.info("RoomService : delete() started reqDomain {}", id);
        Optional<Room> floorOptional = roomRepository.findById(id);
        if (floorOptional.isPresent()) {
            roomRepository.delete(floorOptional.get());
            return new MasterManagerResponse(MasterConstant.SUCCESS);
        } else {
            return new MasterManagerResponse(MasterConstant.NOT_FOUND);
        }
    }
}
