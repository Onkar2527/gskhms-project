package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.PaymentDTO;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.AppointmentBedAssignSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Slf4j
public class AppointmentBedAssignService {

    @Autowired
    AppointmentBedAssignRepository appointmentBedAssignRepository;

	@Autowired
	BedRepository bedRepository;

	@Autowired
	BillingClassRepository billingClassRepository;

	@Autowired
	RoomRepository roomRepository;

	@Autowired
	RoomTypeRepository roomTypeRepository;

	@Autowired
	PaymentService paymentService;

	public MasterManagerResponse search(AppointmentBedAssign reqDomain) {
        log.info("AppointmentBedAssignService : search() started reqDomain {}", reqDomain);
        try {
			Specification<AppointmentBedAssign> spec = Specification.where(AppointmentBedAssignSpecification.withIsActive(1));
			spec = spec.and(Specification.where(AppointmentBedAssignSpecification.withHospitalId(UserContext.getHospitalId())));

			if(Objects.nonNull(reqDomain.getStatus())){
				spec = spec.and(Specification.where(AppointmentBedAssignSpecification.withStatus(reqDomain.getStatus())));
			}
			if(Objects.nonNull(reqDomain.getBedId())){
				spec = spec.and(Specification.where(AppointmentBedAssignSpecification.withBedId(reqDomain.getBedId())));
			}
            List<AppointmentBedAssign> bedDetails = appointmentBedAssignRepository.findAll(spec);
            return new MasterManagerResponse(MasterConstant.SUCCESS, bedDetails);
        } catch (Exception e) {
            log.error("AppointmentBedAssignService : search() Exception occured while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(AppointmentBedAssign reqDomain) {
        reqDomain.setActiveInd(1);
        reqDomain.setHospitalId(UserContext.getHospitalId());
		reqDomain.setStatus("A");
		reqDomain.setStartTime(new Date());
		reqDomain = appointmentBedAssignRepository.save(reqDomain);
        return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
    }

    @Transactional
    public MasterManagerResponse update(AppointmentBedAssign reqDomain) {
        reqDomain.setActiveInd(1);
        reqDomain.setHospitalId(UserContext.getHospitalId());

		Optional<AppointmentBedAssign> appointmentBedAssignOptional = appointmentBedAssignRepository.findById(reqDomain.getId());

		if(appointmentBedAssignOptional.isPresent()){
			AppointmentBedAssign existing  = appointmentBedAssignOptional.get();
			if(!Objects.equals(reqDomain.getBedId(), existing.getBedId())){
                 releaseBedAndCalculateBill(existing.getBedId());

				AppointmentBedAssign appointmentBedAssign = new AppointmentBedAssign();
				appointmentBedAssign.setAppointmentId(reqDomain.getAppointmentId());
				appointmentBedAssign.setBedId(reqDomain.getBedId());
				appointmentBedAssign.setStartTime(new Date());
				appointmentBedAssign.setActiveInd(1);
				appointmentBedAssign.setStatus("A");
				appointmentBedAssign.setHospitalId(UserContext.getHospitalId());
				reqDomain = appointmentBedAssignRepository.save(appointmentBedAssign);

				Optional<Bed> bed = bedRepository.findById(reqDomain.getBedId());
				if(bed.isPresent()){
					Bed bedEntity = bed.get();
					bedEntity.setStatus("B");
					bedRepository.save(bedEntity);
				}
			}else{
				reqDomain.setStartTime(existing.getStartTime());
				reqDomain.setAppointmentId(existing.getAppointmentId());
				reqDomain.setStatus(existing.getStatus());
			}
		}

        reqDomain = appointmentBedAssignRepository.save(reqDomain);
        return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
    }

	@Transactional
	public MasterManagerResponse deleteByAppointmentId(Integer appointmentId) {
		Optional<AppointmentBedAssign> appointmentBedAssignOptional = appointmentBedAssignRepository.findByAppointmentIdAndStatus(appointmentId, "A");

	    if(appointmentBedAssignOptional.isPresent()){
			appointmentBedAssignRepository.delete(appointmentBedAssignOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}

	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		Optional<AppointmentBedAssign> appointmentBedAssignOptional = appointmentBedAssignRepository.findById(id);

		if(appointmentBedAssignOptional.isPresent()){
			appointmentBedAssignRepository.delete(appointmentBedAssignOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}

	@Transactional
	public MasterManagerResponse deleteByBedId(Integer bedId, Integer appointmentId) {
		Optional<AppointmentBedAssign> appointmentBedAssignOptional = appointmentBedAssignRepository.findByBedIdAndStatus(bedId, "A");
		if(appointmentBedAssignOptional.isPresent()){
			appointmentBedAssignRepository.delete(appointmentBedAssignOptional.get());
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}


	@Transactional
	public MasterManagerResponse releaseBedAndCalculateBill(Integer bedId) {

		Optional<AppointmentBedAssign> appointmentBedAssignOptional = appointmentBedAssignRepository.findByBedIdAndStatus(bedId, "A");
		if(appointmentBedAssignOptional.isPresent()){

			AppointmentBedAssign appointmentBedAssign = appointmentBedAssignOptional.get();
			appointmentBedAssign.setEndTime(new Date());
			appointmentBedAssign.setStatus("U");
			appointmentBedAssign = appointmentBedAssignRepository.save(appointmentBedAssign);

			Date startDateWithTime = appointmentBedAssign.getStartTime();
			Date endDateWithTime = appointmentBedAssign.getEndTime();

			Optional<Bed> bedOptional = bedRepository.findById(bedId);

			Integer roomId = null;
			if(bedOptional.isPresent()){
				Bed bed = bedOptional.get();
				bed.setStatus("A");
				roomId = bed.getRoomId();
				bedRepository.save(bed);
				Optional<Room> roomOptional = roomRepository.findById(roomId);
				if(roomOptional.isPresent()){
					Room room = roomOptional.get();
					Integer roomTypeId = room.getRoomTypeId();
					Optional<RoomType> roomTypeOptional = roomTypeRepository.findById(roomTypeId);

					if(roomTypeOptional.isPresent()){
						RoomType roomType = roomTypeOptional.get();

						Optional<BillingClass> billingClassOptional = billingClassRepository.findById(roomType.getBillingClassId());

						if(billingClassOptional.isPresent()){
							BillingClass billingClass = billingClassOptional.get();

							Double chargePerDay = billingClass.getChargePerDay();
							//Double chargePerHour = billingClass.getChargePerHour();

							Double charges = 0.0;
							if(Objects.nonNull(chargePerDay)) {
								//Comparing dates
							//	long difference = Math.abs(endDateWithTime.getTime() - startDateWithTime.getTime());
							//	long differenceDates = difference / (24 * 60 * 60 * 1000);


								Calendar calendar = Calendar.getInstance();
								calendar.setTime(startDateWithTime);

								LocalDateTime start = LocalDateTime.of(calendar.get(Calendar.YEAR),calendar.get(Calendar.MONTH), calendar.get(Calendar.DATE), calendar.get(Calendar.HOUR), calendar.get(Calendar.MINUTE) );

								Calendar calendarEnd = Calendar.getInstance();
								calendarEnd.setTime(endDateWithTime);
								LocalDateTime end = LocalDateTime.of(calendarEnd.get(Calendar.YEAR),calendarEnd.get(Calendar.MONTH), calendarEnd.get(Calendar.DATE), calendarEnd.get(Calendar.HOUR), calendarEnd.get(Calendar.MINUTE) );
								long differenceDates = ChronoUnit.DAYS.between(start, end);
							    //Generate payment receipt
								differenceDates = differenceDates+1;
								charges = differenceDates * chargePerDay;
								log.info("Total days {} and charges {} ", differenceDates, charges);

								PaymentDTO dto = new PaymentDTO();
								dto.setDescription(billingClass.getName()+" Bed charges from "+start+" to "+ end);
								dto.setPaymentStatus("UNPAID");
								dto.setAppointmentId(appointmentBedAssign.getAppointmentId());
								dto.setPaymentDate(new Date());
								dto.setAmount(charges);
								//paymentService.save(dto);
							}
						}
				}
			}
			return new MasterManagerResponse(MasterConstant.SUCCESS);
		}else{
			return new MasterManagerResponse(MasterConstant.NOT_FOUND);
		}
	}
		return new MasterManagerResponse(MasterConstant.SUCCESS);
	}



	@Transactional
	public MasterManagerResponse calculateBedBill(Integer appointmentId) {

		Optional<AppointmentBedAssign> appointmentBedAssignOptional1 = appointmentBedAssignRepository.findByAppointmentIdAndStatus(appointmentId, "A");

		if(appointmentBedAssignOptional1.isPresent()) {
			Integer bedId = appointmentBedAssignOptional1.get().getBedId();

			Optional<AppointmentBedAssign> appointmentBedAssignOptional = appointmentBedAssignRepository.findByBedIdAndStatus(bedId, "A");
			if (appointmentBedAssignOptional.isPresent()) {

				AppointmentBedAssign appointmentBedAssign = appointmentBedAssignOptional.get();
				//appointmentBedAssign.setEndTime(new Date());
				//appointmentBedAssign.setStatus("U");
				//appointmentBedAssign = appointmentBedAssignRepository.save(appointmentBedAssign);

				Date startDateWithTime = appointmentBedAssign.getStartTime();
				Date endDateWithTime = new Date();

				Optional<Bed> bedOptional = bedRepository.findById(bedId);

				Integer roomId = null;
				if (bedOptional.isPresent()) {
					Bed bed = bedOptional.get();
					//	bed.setStatus("A");
					roomId = bed.getRoomId();
					//	bedRepository.save(bed);
					Optional<Room> roomOptional = roomRepository.findById(roomId);
					if (roomOptional.isPresent()) {
						Room room = roomOptional.get();
						Integer roomTypeId = room.getRoomTypeId();
						Optional<RoomType> roomTypeOptional = roomTypeRepository.findById(roomTypeId);

						if (roomTypeOptional.isPresent()) {
							RoomType roomType = roomTypeOptional.get();

							Optional<BillingClass> billingClassOptional = billingClassRepository.findById(roomType.getBillingClassId());

							if (billingClassOptional.isPresent()) {
								BillingClass billingClass = billingClassOptional.get();

								Double chargePerDay = billingClass.getChargePerDay();
								//Double chargePerHour = billingClass.getChargePerHour();

								Double charges = 0.0;
								if (Objects.nonNull(chargePerDay)) {
									//Comparing dates
									//	long difference = Math.abs(endDateWithTime.getTime() - startDateWithTime.getTime());
									//	long differenceDates = difference / (24 * 60 * 60 * 1000);


									Calendar calendar = Calendar.getInstance();
									calendar.setTime(startDateWithTime);

									LocalDateTime start = LocalDateTime.of(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DATE), calendar.get(Calendar.HOUR), calendar.get(Calendar.MINUTE));

									Calendar calendarEnd = Calendar.getInstance();
									calendarEnd.setTime(endDateWithTime);
									LocalDateTime end = LocalDateTime.of(calendarEnd.get(Calendar.YEAR), calendarEnd.get(Calendar.MONTH), calendarEnd.get(Calendar.DATE), calendarEnd.get(Calendar.HOUR), calendarEnd.get(Calendar.MINUTE));
									long differenceDates = ChronoUnit.DAYS.between(start, end);
									//Generate payment receipt
									differenceDates = differenceDates + 1;
									charges = differenceDates * chargePerDay;
									log.info("Total days {} and charges {} ", differenceDates, charges);

									PaymentDTO dto = new PaymentDTO();
									dto.setDescription(billingClass.getName() + " Bed charges from " + start + " to " + end);
									dto.setPaymentStatus("UNPAID");
									dto.setAppointmentId(appointmentBedAssign.getAppointmentId());
									dto.setPaymentDate(new Date());
									dto.setAmount(charges);
									paymentService.save(dto);
								}
							}
						}
					}
					return new MasterManagerResponse(MasterConstant.SUCCESS);
				} else {
					return new MasterManagerResponse(MasterConstant.NOT_FOUND);
				}
			}
		}
		return new MasterManagerResponse(MasterConstant.SUCCESS);
	}


	public Optional<AppointmentBedAssign> getByAppointmentAndStatusAssigned(Integer appointmentId) {
		return appointmentBedAssignRepository.findByAppointmentIdAndStatus(appointmentId, "A");
	}
}
