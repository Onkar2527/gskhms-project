package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.Bed;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.BedMapper;
import com.codecraft.master.models.BedDTO;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.BedRepository;
import com.codecraft.master.repositories.RoomRepository;
import com.codecraft.master.specifications.BedSpecification;
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

@Service
@Slf4j
public class BedService {

    @Autowired
    BedRepository bedRepository;

    @Autowired
    BedMapper bedMapper;

    @Autowired
    RoomRepository roomRepository;

    public MasterManagerResponse search(Bed reqDomain) {
        log.info("BedService : search() started reqDomain {}", reqDomain);
        try {


            Specification<Bed> spec = Specification.where(BedSpecification.withHospitalId(UserContext.getHospitalId()));
            spec = spec.and(Specification.where(BedSpecification.withIsActive(1)));

            if(Objects.nonNull(reqDomain.getRoomId())){
                spec = spec.and(Specification.where(BedSpecification.withRoomId(reqDomain.getRoomId())));
            }
            List<Bed> bedDetails = bedRepository.findAll(spec);

            List<BedDTO> bedDTOList = new ArrayList<>();
            bedDetails.forEach(bed -> bedDTOList.add(getBedDTO(bed)));

            return new MasterManagerResponse(MasterConstant.SUCCESS, bedDTOList);
        } catch (Exception e) {
            log.error("BedService : search() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private BedDTO getBedDTO(Bed bed) {
        BedDTO bedDTO = bedMapper.bedToBedDTO(bed);
        if (Objects.nonNull(bedDTO.getRoomId())) {
            roomRepository.findById(bedDTO.getRoomId()).ifPresent(room -> bedDTO.setRoomName(room.getName()));
        }
        return bedDTO;
    }

    @Transactional
    public MasterManagerResponse save(Bed reqDomain) {
        log.info("BedService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getStatus())) {
                reqDomain.setStatus("A");
            }
            reqDomain = bedRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getBedDTO(reqDomain));
        } catch (Exception e) {
            log.error("BedService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(Bed reqDomain) {
        log.info("BedService : update() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);
            reqDomain.setHospitalId(UserContext.getHospitalId());
            if(Objects.isNull(reqDomain.getStatus())) {
                reqDomain.setStatus("A");
            }
            reqDomain = bedRepository.save(reqDomain);
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, getBedDTO(reqDomain));
        } catch (Exception e) {
            log.error("BedService : update() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse delete(Integer id) {
        log.info("BedService : delete() started reqDomain {}", id);
        Optional<Bed> bedOptional = bedRepository.findById(id);
        if (bedOptional.isPresent()) {
            bedRepository.delete(bedOptional.get());
            return new MasterManagerResponse(MasterConstant.SUCCESS);
        } else {
            return new MasterManagerResponse(MasterConstant.NOT_FOUND);
        }
    }
}
