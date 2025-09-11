package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.mappers.AppointmentMapper;
import com.codecraft.master.mappers.BedMapper;
import com.codecraft.master.mappers.FloorMapper;
import com.codecraft.master.mappers.RoomMapper;
import com.codecraft.master.models.*;
import com.codecraft.master.repositories.*;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class HospitalInfraService {
	@Autowired
	FloorRepository floorRepository;

	@Autowired
	FloorMapper floorMapper;

	@Autowired
	BedMapper bedMapper;

	@Autowired
	BedRepository bedRepository;

	@Autowired
	RoomRepository roomRepository;

	@Autowired
	RoomMapper roomMapper;

	@Autowired
	RoomTypeRepository roomTypeRepository;

	@Autowired
	AppointmentBedAssignRepository appointmentBedAssignRepository;

	@Autowired
	AppointmentMapper appointmentMapper;

	@Autowired
	AppointmentRepository appointmentRepository;

	public MasterManagerResponse get() {
		HospitalInfraDTO hospitalInfraDTO = new HospitalInfraDTO();
		List<FloorDTO> floorsDTOList = new ArrayList<>();
		List<Floor> floorsList = floorRepository.findByHospitalId(UserContext.getHospitalId());
		floorsList.forEach(floor -> {
			FloorDTO floorDTO = floorMapper.floorToFloorDTO(floor);
            List<Room> roomList = roomRepository.findByFloorId(floorDTO.getId());

			List<RoomDTO> roomDTOList = new ArrayList<>();
			roomList.forEach(room -> {

				RoomDTO roomDTO = roomMapper.roomToRoomDTO(room);
				if (Objects.nonNull(roomDTO.getRoomTypeId())) {
					Optional<RoomType> roomTypeOptional = roomTypeRepository.findById(roomDTO.getRoomTypeId());
					roomTypeOptional.ifPresent(roomType -> roomDTO.setRoomTypeName(roomType.getName()));
				}
				if (Objects.nonNull(roomDTO.getFloorId())) {
					Optional<Floor> floorOptional = floorRepository.findById(roomDTO.getFloorId());
					floorOptional.ifPresent(floor1 -> roomDTO.setFloorName(floor1.getName()));
				}

				List<Bed> bedList = bedRepository.findByRoomId(roomDTO.getId());

				List<BedDTO> bedDTOList = new ArrayList<>();
				bedList.forEach(bed -> {

					BedDTO bedDTO = bedMapper.bedToBedDTO(bed);
					AtomicReference<Integer> appointmentId = new AtomicReference<>();
					appointmentBedAssignRepository.findByBedIdAndStatus(bed.getId(), "A").ifPresent(assigned -> appointmentId.set(assigned.getAppointmentId()));

					if(Objects.nonNull(appointmentId.get())){
						Optional<Appointment> appointment = appointmentRepository.findById(appointmentId.get());
						if(appointment.isPresent()){
							bedDTO.setPatient(appointmentMapper.appointmentToPatient(appointment.get()));
						}
					}
					if (Objects.nonNull(bedDTO.getRoomId())) {
						roomRepository.findById(bedDTO.getRoomId()).ifPresent(room1 -> bedDTO.setRoomName(room1.getName()));
					}
					bedDTOList.add(bedDTO);

				});
				roomDTO.setBeds(bedDTOList);
				roomDTOList.add(roomDTO);
			} );

			floorDTO.setRooms(roomDTOList);
			floorsDTOList.add(floorDTO);
		});
		hospitalInfraDTO.setFloors(floorsDTOList);
		return new MasterManagerResponse(MasterConstant.SUCCESS, hospitalInfraDTO);
	}


	public MasterManagerResponse get(Integer doctorId) {
		HospitalInfraDTO hospitalInfraDTO = new HospitalInfraDTO();
		List<FloorDTO> floorsDTOList = new ArrayList<>();
		List<Floor> floorsList = floorRepository.findByHospitalId(UserContext.getHospitalId());
		floorsList.forEach(floor -> {
			FloorDTO floorDTO = floorMapper.floorToFloorDTO(floor);
			List<Room> roomList = roomRepository.findByFloorId(floorDTO.getId());

			List<RoomDTO> roomDTOList = new ArrayList<>();
			roomList.forEach(room -> {

				RoomDTO roomDTO = roomMapper.roomToRoomDTO(room);
				if (Objects.nonNull(roomDTO.getRoomTypeId())) {
					Optional<RoomType> roomTypeOptional = roomTypeRepository.findById(roomDTO.getRoomTypeId());
					roomTypeOptional.ifPresent(roomType -> roomDTO.setRoomTypeName(roomType.getName()));
				}
				if (Objects.nonNull(roomDTO.getFloorId())) {
					Optional<Floor> floorOptional = floorRepository.findById(roomDTO.getFloorId());
					floorOptional.ifPresent(floor1 -> roomDTO.setFloorName(floor1.getName()));
				}

				List<Bed> bedList = bedRepository.findByRoomId(roomDTO.getId());

				List<BedDTO> bedDTOList = new ArrayList<>();
				bedList.forEach(bed -> {

					BedDTO bedDTO = bedMapper.bedToBedDTO(bed);
					AtomicReference<Integer> appointmentId = new AtomicReference<>();
					appointmentBedAssignRepository.findByBedIdAndStatus(bed.getId(), "A").ifPresent(assigned -> appointmentId.set(assigned.getAppointmentId()));

					if(Objects.nonNull(appointmentId.get())){
						Optional<Appointment> appointment = appointmentRepository.findById(appointmentId.get());
						if(appointment.isPresent()){
							bedDTO.setPatient(appointmentMapper.appointmentToPatient(appointment.get()));
							bedDTO.setDoctorId(appointment.get().getDoctorId());
							bedDTO.setSecDoctorId(appointment.get().getSecDoctorId());
						}
					}
					if (Objects.nonNull(bedDTO.getRoomId())) {
						roomRepository.findById(bedDTO.getRoomId()).ifPresent(room1 -> bedDTO.setRoomName(room1.getName()));
					}
					if(Objects.equals(doctorId, bedDTO.getDoctorId()) || Objects.equals(doctorId, bedDTO.getSecDoctorId())) {
						bedDTOList.add(bedDTO);
					}
				});
				roomDTO.setBeds(bedDTOList);
				roomDTOList.add(roomDTO);
			} );

			floorDTO.setRooms(roomDTOList);
			floorsDTOList.add(floorDTO);
		});
		hospitalInfraDTO.setFloors(floorsDTOList);
		return new MasterManagerResponse(MasterConstant.SUCCESS, hospitalInfraDTO);
	}

	@Transactional
	public MasterManagerResponse save(HospitalInfraDTO hospitalInfraDTO) {

		if(!CollectionUtils.isEmpty(hospitalInfraDTO.getFloors())){
			hospitalInfraDTO.getFloors().forEach(floorDTO -> {
				Floor floor =  floorMapper.floorDTOToFloor(floorDTO);
				floor.setActiveInd(1);
				if(Objects.isNull(floorDTO.getStatus())) {
					floor.setStatus("A");
				}
				floor.setHospitalId(UserContext.getHospitalId());
				floor = floorRepository.save(floor);
				if(!CollectionUtils.isEmpty(floorDTO.getRooms())){

					Floor finalFloor = floor;
					floorDTO.getRooms().forEach(roomDTO -> {
						Room room = roomMapper.roomDTOToRoom(roomDTO);
						if(Objects.isNull(roomDTO.getStatus())) {
							room.setStatus("A");
						}
						room.setActiveInd(1);
						room.setHospitalId(UserContext.getHospitalId());
						room.setFloorId(finalFloor.getId());
						room.setTotalBed(Objects.nonNull(roomDTO.getBeds())? roomDTO.getBeds().size():0);
						room = roomRepository.save(room);

						if(!CollectionUtils.isEmpty(roomDTO.getBeds())){
							Room finalRoom = room;
							roomDTO.getBeds().forEach(bedDTO -> {
								Bed bed = bedMapper.bedDTOToBed(bedDTO);
								bed.setActiveInd(1);
								bed.setHospitalId(UserContext.getHospitalId());
								bed.setRoomId(finalRoom.getId());
								if(Objects.isNull(bedDTO.getStatus())) {
									bed.setStatus("A");
								}
								bedRepository.save(bed);
							});
						}
					});
				}
			});
		}
		return new MasterManagerResponse(MasterConstant.SUCCESS);
	}


	@Transactional
	public MasterManagerResponse update(HospitalInfraDTO hospitalInfraDTO) {

		if(!CollectionUtils.isEmpty(hospitalInfraDTO.getFloors())){
			hospitalInfraDTO.getFloors().forEach(floorDTO -> {
				Floor floor =  floorMapper.floorDTOToFloor(floorDTO);
				floor.setActiveInd(1);
				floor.setHospitalId(UserContext.getHospitalId());
				if(Objects.isNull(floorDTO.getStatus())) {
					floor.setStatus("A");
				}
				floor = floorRepository.save(floor);
				if(!CollectionUtils.isEmpty(floorDTO.getRooms())){

					Floor finalFloor = floor;
					floorDTO.getRooms().forEach(roomDTO -> {
						Room room = roomMapper.roomDTOToRoom(roomDTO);
						room.setActiveInd(1);
						room.setHospitalId(UserContext.getHospitalId());
						room.setFloorId(finalFloor.getId());
						if(Objects.isNull(roomDTO.getStatus())) {
							room.setStatus("A");
						}
						room = roomRepository.save(room);

						if(!CollectionUtils.isEmpty(roomDTO.getBeds())){
							Room finalRoom = room;
							roomDTO.getBeds().forEach(bedDTO -> {
								Bed bed = bedMapper.bedDTOToBed(bedDTO);
								bed.setActiveInd(1);
								bed.setHospitalId(UserContext.getHospitalId());
								bed.setRoomId(finalRoom.getId());
								if(Objects.isNull(bedDTO.getStatus())) {
									bed.setStatus("A");
								}
								bedRepository.save(bed);
							});
						}
					});
				}
			});
		}
		return new MasterManagerResponse(MasterConstant.SUCCESS);
	}
}
