package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.CasualityDetailsMapper;
import com.codecraft.master.mappers.CasualityHeaderMapper;
import com.codecraft.master.models.*;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.CasualityHeaderSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
public class CasualtyHeaderService {
	
	@Autowired
	CasulalityHedarRepository casulalityHedarRepository;

	@Autowired
	CasulalityDetailRepository casulalityDetailRepository;

	@Autowired
	CasualityHeaderMapper casualityHeaderMapper;

	@Autowired
	CasualityDetailsMapper casualityDetailsMapper;

	@Autowired
	AppointmentServiceRepository appointmentServiceRepository;

	@Autowired
	LabRegistrationService registrationService;

	@Autowired
	ServiceHelper serviceHelper;

	@Autowired
	HospitalRepository hospitalRepository;

	@Autowired
	PathologyTestsRepository pathologyTestsRepository;

	@Autowired
	PaymentService paymentService;

	@Autowired
	PackageMasterRepository packageMasterRepository;
	@Autowired
	AppointmentRepository appointmentRepository;

	@Autowired
	OrganisationRepository organisationRepository;


	@Autowired
	DocumentNumberRepository documentNumberRepository;
	public MasterManagerResponse search(CasualityHeaderDTO reqDomain) {
		log.info("CasualityHedarService : search() started reqDomain {}", reqDomain);
		try {
			Specification<CasualityHeader> spec = Specification.where(CasualityHeaderSpecification.withIsActive(1));
			spec = spec.and(Specification.where(CasualityHeaderSpecification.withIsActive(1)));

			if(Objects.nonNull(reqDomain.getAppointmentId())){
				spec = spec.and(Specification.where(CasualityHeaderSpecification.withAppointmentId(reqDomain.getAppointmentId())));
			}

			if(Objects.nonNull(reqDomain.getPatientId())){
				spec = spec.and(Specification.where(CasualityHeaderSpecification.withPatientId(reqDomain.getPatientId())));
			}

			if(Objects.nonNull(reqDomain.getId())){
				spec = spec.and(Specification.where(CasualityHeaderSpecification.withId(reqDomain.getId())));
			}

			List<CasualityHeader> casualityHeaders = casulalityHedarRepository.findAll(spec);
			List<CasualityHeaderDTO> casualityHeadersDTO = new ArrayList<>();
			casualityHeaders.forEach(casualityHeader -> casualityHeadersDTO.add(getCasualityHeader(casualityHeader.getId())));
			return new MasterManagerResponse(MasterConstant.SUCCESS, casualityHeadersDTO);
		} catch (Exception e) {
			log.error("PathologyTestsService : search() Exception occured while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public MasterManagerResponse save(CasualityHeaderDTO reqDomain) {
		log.info("CasualityHeaderService : save() started reqDomain {}", reqDomain);
		try {

			CasualityHeader casualityHeader = casualityHeaderMapper.casualityHeaderDTOToCasualityHeader(reqDomain);
			casualityHeader.setActiveInd(1);
			casualityHeader = casulalityHedarRepository.save(casualityHeader);

			if (!CollectionUtils.isEmpty(reqDomain.getCasualityDetailList())) {
				CasualityHeader finalCasualityHeader = casualityHeader;
				reqDomain.getCasualityDetailList().forEach(casualityDetailDTO -> {
					CasualityDetail casualityDetail = casualityDetailsMapper.casualityDetailDTOToCasualityDetails(casualityDetailDTO);
					casualityDetail.setCasualtyId(finalCasualityHeader.getId());
					casualityDetail.setActiveInd(1);
					casulalityDetailRepository.save(casualityDetail);
				});
			}
			//generate lab by getting services


			Optional<Hospital> hospitalOptional = hospitalRepository.findById(UserContext.getHospitalId());
			if (hospitalOptional.isPresent()) {
				Hospital hospital = hospitalOptional.get();
			List<String> hospitalServices = new ArrayList<>();
            if("Y".equalsIgnoreCase(hospital.getLabServices())){
				hospitalServices.add("T");
			}
			if("Y".equalsIgnoreCase(hospital.getXrayServices())){
				hospitalServices.add("X");
			}
			if("Y".equalsIgnoreCase(hospital.getSonoServices())){
				hospitalServices.add("Q");
			}
				AtomicReference<String> paymentDescription= new AtomicReference<>("");
				AtomicReference<Double> paymentAmount= new AtomicReference<>(0.0);


				hospitalServices.forEach(labType -> {
				List<AppointmentServiceEntity> appointmentServiceEntityList = appointmentServiceRepository.findByTypeAndAppointmentIdAndLabNoGenerated(labType, reqDomain.getAppointmentId(), "N");
				if (!CollectionUtils.isEmpty(appointmentServiceEntityList)) {

					LabRegistrationDTO registration = new LabRegistrationDTO();
					registration.setStatus("Pending For Sample");
					registration.setPatientId(reqDomain.getPatientId());
					registration.setAppointmentId(reqDomain.getAppointmentId());
					registration.setType(labType);
					registration.setRegistrationDate(new Date());
					registration.setLabNumber(getLabNumber());
					List<LabTestHeaderDTO> labTestHeaderList = new ArrayList<>();


					appointmentServiceEntityList.forEach(appointmentServiceEntity -> {
						paymentAmount.set(paymentAmount.get() + appointmentServiceEntity.getCharges());
						LabTestHeaderDTO labTestHeaderDTO = new LabTestHeaderDTO();
						labTestHeaderDTO.setServiceId(appointmentServiceEntity.getServiceId());

						if (appointmentServiceEntity.getCharges() != 0) {
							Optional<PathologyTests> pathologyTestsOptional = pathologyTestsRepository.findById(appointmentServiceEntity.getServiceId());
							if (pathologyTestsOptional.isPresent()) {
								if (Objects.isNull(paymentDescription.get()) || paymentDescription.get().isEmpty()) {
									paymentDescription.set(pathologyTestsOptional.get().getName());
								} else {
									paymentDescription.set(paymentDescription.get() + ", " + pathologyTestsOptional.get().getName());
								}
							}
						}
						labTestHeaderList.add(labTestHeaderDTO);
						appointmentServiceEntity.setLabNumber(registration.getLabNumber());
						appointmentServiceEntity.setLabNoGenerated("Y");
						appointmentServiceRepository.save(appointmentServiceEntity);
					});
					registration.setLabTestHeaderList(labTestHeaderList);
					registrationService.saveWithPayment(registration);
				}
				});

				List<AppointmentServiceEntity> appointmentServiceEntityList = appointmentServiceRepository.findByTypeAndAppointmentIdAndLabNoGenerated("P", reqDomain.getAppointmentId(), "N");
				appointmentServiceEntityList.forEach(appointmentServiceEntity -> {

					Optional<PackageMaster> packageMasterOptional = packageMasterRepository.findById(appointmentServiceEntity.getServiceId());

					if(packageMasterOptional.isPresent()) {
						PackageMaster pm = packageMasterOptional.get();

						if (Objects.isNull(paymentDescription.get()) || paymentDescription.get().isEmpty()) {
							paymentDescription.set(pm.getName());
						} else {
							paymentDescription.set(paymentDescription.get() + ", " + pm.getName());
						}

						paymentAmount.set(paymentAmount.get() + appointmentServiceEntity.getCharges());

						appointmentServiceEntity.setLabNoGenerated("Y");
						appointmentServiceRepository.save(appointmentServiceEntity);
					}
				});


				if (paymentAmount.get() != 0) {

						PaymentDTO dto = new PaymentDTO();
						dto.setDescription(paymentDescription.get());
						dto.setPaymentStatus("UNPAID");
						dto.setAppointmentId(reqDomain.getAppointmentId());
						dto.setPaymentDate(new Date());

						if (Objects.nonNull(reqDomain.getAppointmentId())) {
							Optional<Appointment> appointmentOptional = appointmentRepository.findById(reqDomain.getAppointmentId());

							if (appointmentOptional.isPresent()) {
								Appointment appointment = appointmentOptional.get();
								if (Objects.nonNull(appointment.getOrganizationId())) {
									Optional<Organisation> organisationOptional = organisationRepository.findById(appointment.getOrganizationId());
									if (organisationOptional.isPresent() && Objects.nonNull(organisationOptional.get().getRatePercentage()) && organisationOptional.get().getRatePercentage() > 0.0) {
										Double totalAmount = paymentAmount.get() * organisationOptional.get().getRatePercentage() / 100;
										paymentAmount.set(totalAmount);
									}
								}
							}
						}
						dto.setAmount(paymentAmount.get());
						paymentService.save(dto);
				}
		}

			return new MasterManagerResponse(MasterConstant.DATA_SAVED,getCasualityHeader(casualityHeader.getId()));
		} catch (Exception e) {
			log.error("PathologyTestsService : save() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private String getLabNumber() {
		Calendar calendar = Calendar.getInstance();
		String hospitalCode = serviceHelper.getHospitalCodeByHospitalId(UserContext.getHospitalId());
		String documentNumber;
		Optional<DocumentNumber> documentNumberOptional = documentNumberRepository.findByDocTypeAndSubDocTypeAndYearAndHospitalId("LAB",hospitalCode, String.valueOf(calendar.get(Calendar.YEAR)), UserContext.getHospitalId());
		if (documentNumberOptional.isPresent()) {
			DocumentNumber d = documentNumberOptional.get();
			documentNumber = d.getDocType() + "/" + d.getSubDocType() + "/" + d.getYear() + "/" + String.format("%07d", d.getDocumentNumber() + 1);
			d.setDocumentNumber(d.getDocumentNumber() + 1);
			documentNumberRepository.save(d);
		} else {
			DocumentNumber d = new DocumentNumber();
			d.setDocType("LAB");
			d.setSubDocType(hospitalCode);
			d.setYear(String.valueOf(calendar.get(Calendar.YEAR)));
			d.setHospitalId(UserContext.getHospitalId());
			d.setDocumentNumber(1);
			d.setActiveInd(1);
			documentNumberRepository.save(d);

			documentNumber = d.getDocType() + "/" + d.getSubDocType() + "/" + calendar.get(Calendar.YEAR) + "/0000001";
		}
		return documentNumber;
	}

	private CasualityHeaderDTO getCasualityHeader(Integer id) {

		Optional<CasualityHeader> casualityHeaderOptional = casulalityHedarRepository.findById(id);
		if(casualityHeaderOptional.isPresent()) {
			CasualityHeader casualityHeader = casualityHeaderOptional.get();
			CasualityHeaderDTO casualityHeaderDTO = casualityHeaderMapper.casualityHeaderToCasualityHeaderDTO(casualityHeader);

			List<CasualityDetailDTO> casualityDetailDTOList = new ArrayList<>();
			List<CasualityDetail> casualityDetailList = casulalityDetailRepository.findByCasualtyId(id);
			casualityDetailList.forEach(casualityDetail -> {
				casualityDetailDTOList.add(casualityDetailsMapper.casualityDetailToCasualityDetailDTO(casualityDetail));
			});
			casualityHeaderDTO.setRecordCreatedBy(serviceHelper.getNameByEmployeeEmailId(casualityHeader.getCreatedBy()));
			casualityHeaderDTO.setCasualityDetailList(casualityDetailDTOList);
			return casualityHeaderDTO;
		}else{
			throw new MasterManagerException(MasterConstant.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Transactional
	public MasterManagerResponse deleteById(Integer id) {
		log.info("CasualityHedarService : deleteById() started reqDomain {}", id);
		try {
			casulalityHedarRepository.deleteById(id);
			return new MasterManagerResponse(MasterConstant.DATA_SAVED);
		} catch (Exception e) {
			log.error("PathologyTestsService : deleteById() Exception occurred while fetching quantity details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}