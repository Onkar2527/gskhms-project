package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.BillingClass;
import com.codecraft.master.entities.RoomType;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.RoomTypeMapper;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.RoomTypeDTO;
import com.codecraft.master.repositories.BillingClassRepository;
import com.codecraft.master.repositories.RoomTypeRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class RoomTypeService {

    @Autowired
    RoomTypeRepository roomTypeRepository;

    @Autowired
    RoomTypeMapper roomTypeMapper;

    @Autowired
    BillingClassRepository billingClassRepository;

    public MasterManagerResponse search(RoomType reqDomain) {
        log.info("RoomTypeService : search() started reqDomain {}", reqDomain);
        try {
            List<RoomType> roomTypeDetails = roomTypeRepository.findByHospitalId(UserContext.getHospitalId());

            List<RoomTypeDTO> roomTypeDTOList = new ArrayList<>();

            roomTypeDetails.forEach(roomType -> roomTypeDTOList.add(getRoomTypeDTO(roomType)));

            return new MasterManagerResponse(MasterConstant.SUCCESS, roomTypeDTOList);
        } catch (Exception e) {
            log.error("RoomTypeService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private RoomTypeDTO getRoomTypeDTO(RoomType roomType) {
        RoomTypeDTO roomTypeDTO = roomTypeMapper.roomTypeToRoomTypeDTO(roomType);
        if(Objects.nonNull(roomTypeDTO.getBillingClassId())) {
            Optional<BillingClass> billingClassOptional = billingClassRepository.findById(roomTypeDTO.getBillingClassId());
            billingClassOptional.ifPresent(billingClass -> roomTypeDTO.setBillingClassName(billingClass.getName()));
        }
        return roomTypeDTO;
    }

    @Transactional
    public MasterManagerResponse save(RoomType reqDomain) {
        log.info("RoomTypeService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = roomTypeRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getRoomTypeDTO(reqDomain));
        } catch (Exception e) {
            log.error("RoomTypeService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(RoomType reqDomain) {
        log.info("RoomTypeService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            reqDomain = roomTypeRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getRoomTypeDTO(reqDomain));
        } catch (Exception e) {
            log.error("RoomTypeService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        log.info("RoomTypeService : delete() started reqDomain {}", id);
        Optional<RoomType> roomTypeOptional = roomTypeRepository.findById(id);
        if(roomTypeOptional.isPresent()){
            roomTypeRepository.delete(roomTypeOptional.get());
            return new MasterManagerResponse(MasterConstant.SUCCESS);
        }else{
            return new MasterManagerResponse(MasterConstant.NOT_FOUND);
        }
    }
}
