package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.*;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.mappers.LabRegistrationMapper;
import com.codecraft.master.models.*;
import com.codecraft.master.repositories.*;
import com.codecraft.master.specifications.LabRegistrationSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.SimpleDateFormat;
import java.time.*;
import java.util.*;

@Service
@Slf4j
public class LabRegistrationService {

    @Autowired
    LabRegistrationRepository labRegistrationRepository;

    @Autowired
    LabTestDetailsRepository labTestDetailsRepository;

    @Autowired
    LabTestHeaderRepository labTestHeaderRepository;

    @Autowired
    LabRegistrationMapper labRegistrationMapper;

    @Autowired
    PathologyTestsRepository pathologyTestsRepository;

    @Autowired
    PathologyTestDetailsRepository pathologyTestDetailsRepository;

    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    PathologyTestAgeRangeRepository pathologyTestAgeRangeRepository;


    public MasterManagerResponse search(LabRegistrationSearchDTO reqDomain) {
        log.info("LabRegistrationService : search() started reqDomain {}", reqDomain);
        try {

            Specification<LabRegistration> spec = Specification.where(LabRegistrationSpecification.withIsActive(1));

            if (Objects.nonNull(reqDomain.getRegistrationId())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withRegistrationId(reqDomain.getRegistrationId())));
            }

            if (Objects.nonNull(reqDomain.getLabNumber())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withLabNumber(reqDomain.getLabNumber())));
            }

            if (Objects.nonNull(reqDomain.getPatientId())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withPatientId(reqDomain.getPatientId())));
            }

            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withAppointmentId(reqDomain.getAppointmentId())));
            }

            if (Objects.nonNull(reqDomain.getStatus())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withStatus(reqDomain.getStatus())));
            }

            if (Objects.nonNull(reqDomain.getApprovalStatus())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withApprovalStatus(reqDomain.getApprovalStatus())));
            }
            if (Objects.nonNull(reqDomain.getStatuses()) && !CollectionUtils.isEmpty(reqDomain.getStatuses())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withInStatuses(reqDomain.getStatuses())));
            }

            if (Objects.nonNull(reqDomain.getType())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withType(reqDomain.getType())));
            }

            if (Objects.nonNull(reqDomain.getFirstName())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.joinFirstName(reqDomain.getFirstName())));
            }
            if (Objects.nonNull(reqDomain.getLastName())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.joinLastName(reqDomain.getLastName())));
            }
            if (Objects.nonNull(reqDomain.getRegistrationStartDate()) && Objects.nonNull(reqDomain.getRegistrationEndDate())) {
                spec = spec.and(Specification.where(LabRegistrationSpecification.withRegistrationDateDetween(reqDomain.getRegistrationStartDate(), reqDomain.getRegistrationEndDate())));
            }

            List<LabRegistration> labRegistrations = labRegistrationRepository.findAll(spec);


            List<LabRegistrationDTO> labRegistrationDTOList = new ArrayList<>();
            labRegistrations.forEach(labRegistration -> labRegistrationDTOList.add(getDetailByRegistrationId(labRegistration.getId())));
            return new MasterManagerResponse(MasterConstant.SUCCESS, labRegistrationDTOList);
        } catch (Exception e) {
            log.error("BedService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(LabRegistrationDTO reqDomain) {
        log.info("LabRegistrationService : save() started reqDomain {}", reqDomain);
        try {
            LabRegistration labRegistrationEntity = labRegistrationMapper.labRegistrationDTOToLabRegistration(reqDomain);
            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                labRegistrationEntity.setAppointment(new Appointment(reqDomain.getAppointmentId()));
            }
            labRegistrationEntity.setActiveInd(1);
            labRegistrationEntity.setHospitalId(UserContext.getHospitalId());
            labRegistrationEntity.setApprovalStatus("P");  //Pending
            labRegistrationEntity = labRegistrationRepository.save(labRegistrationEntity);

            LabRegistration finalLabRegistrationEntity = labRegistrationEntity;
            reqDomain.getLabTestHeaderList().forEach(labTestHeaderDTO -> {

                LabTestHeader testHeader = labRegistrationMapper.labTestHeaderDTOToLabTestHeader(labTestHeaderDTO);
                testHeader.setActiveInd(1);
                testHeader.setRegistrationId(finalLabRegistrationEntity.getId());
                testHeader = labTestHeaderRepository.save(testHeader);

                LabTestHeader finalTestHeader = testHeader;
                List<PathologyTestDetails> pathologyTestDetailsList = pathologyTestDetailsRepository.findByPathologyTestId(testHeader.getServiceId());

                pathologyTestDetailsList.forEach(pathologyTestDetails -> {
                    LabTestDetails testDetails = new LabTestDetails();
                    testDetails.setActiveInd(1);
                    testDetails.setServiceId(finalTestHeader.getServiceId());
                    testDetails.setTestHeaderId(finalTestHeader.getId());
                    testDetails.setRegistrationId(finalLabRegistrationEntity.getId());
                    testDetails.setNormalMax(pathologyTestDetails.getNormalMax());
                    testDetails.setNormalMin(pathologyTestDetails.getNormalMin());
                    testDetails.setServiceDetailedId(pathologyTestDetails.getId());
                    testDetails.setValue("0.0");
                    labTestDetailsRepository.save(testDetails);
                });
            });

            reqDomain = getDetailByRegistrationId(labRegistrationEntity.getId());
            return new MasterManagerResponse(MasterConstant.DATA_SAVED, reqDomain);
        } catch (Exception e) {
            log.error("LabRegistrationService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public void saveWithPayment(LabRegistrationDTO reqDomain) {
        log.info("LabRegistrationService : saveWithPayment() started reqDomain {}", reqDomain);
        try {
            LabRegistration labRegistrationEntity = labRegistrationMapper.labRegistrationDTOToLabRegistration(reqDomain);
            if (Objects.nonNull(reqDomain.getAppointmentId())) {
                labRegistrationEntity.setAppointment(new Appointment(reqDomain.getAppointmentId()));
            }
            labRegistrationEntity.setActiveInd(1);
            labRegistrationEntity.setHospitalId(UserContext.getHospitalId());
            labRegistrationEntity.setApprovalStatus("P");  //Pending
            labRegistrationEntity = labRegistrationRepository.save(labRegistrationEntity);

            LabRegistration finalLabRegistrationEntity = labRegistrationEntity;
            reqDomain.getLabTestHeaderList().forEach(labTestHeaderDTO -> {

                LabTestHeader testHeader = labRegistrationMapper.labTestHeaderDTOToLabTestHeader(labTestHeaderDTO);
                testHeader.setActiveInd(1);
                testHeader.setRegistrationId(finalLabRegistrationEntity.getId());
                testHeader = labTestHeaderRepository.save(testHeader);

                LabTestHeader finalTestHeader = testHeader;
                List<PathologyTestDetails> pathologyTestDetailsList = pathologyTestDetailsRepository.findByPathologyTestId(testHeader.getServiceId());

                pathologyTestDetailsList.forEach(pathologyTestDetails -> {
                    LabTestDetails testDetails = new LabTestDetails();
                    testDetails.setActiveInd(1);
                    testDetails.setServiceId(finalTestHeader.getServiceId());
                    testDetails.setTestHeaderId(finalTestHeader.getId());
                    testDetails.setRegistrationId(finalLabRegistrationEntity.getId());
                    testDetails.setNormalMax(pathologyTestDetails.getNormalMax());
                    testDetails.setNormalMin(pathologyTestDetails.getNormalMin());
                    testDetails.setServiceDetailedId(pathologyTestDetails.getId());
                    testDetails.setValue("0.0");
                    labTestDetailsRepository.save(testDetails);
                });
            });

        } catch (Exception e) {
            log.error("LabRegistrationService : saveWithPayment() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(LabRegistrationDTO reqDomain) {
        log.info("LabRegistrationService : update() started reqDomain {}", reqDomain);
        try {
            Optional<LabRegistration> labRegistrationOptional = labRegistrationRepository.findById(reqDomain.getId());

            if (labRegistrationOptional.isPresent()) {
                LabRegistration labRegistrationEntity = getLabRegistration(reqDomain, labRegistrationOptional);
                if (Objects.nonNull(reqDomain.getAppointmentId())) {
                    labRegistrationEntity.setAppointment(new Appointment(reqDomain.getAppointmentId()));
                }
                if ("A".equalsIgnoreCase(labRegistrationEntity.getApprovalStatus())) {
                    labRegistrationEntity.setApprovalDate(new Date());
                    labRegistrationEntity.setApprovedBy(UserContext.getCurrentUser());
                }

                labRegistrationEntity = labRegistrationRepository.save(labRegistrationEntity);

                LabRegistration finalLabRegistrationEntity = labRegistrationEntity;
                reqDomain.getLabTestHeaderList().forEach(labTestHeaderDTO -> {
                    LabTestHeader testHeader = labRegistrationMapper.labTestHeaderDTOToLabTestHeader(labTestHeaderDTO);
                    testHeader.setActiveInd(1);
                    testHeader.setRegistrationId(finalLabRegistrationEntity.getId());
                    testHeader = labTestHeaderRepository.save(testHeader);

                    LabTestHeader finalTestHeader = testHeader;
                    labTestHeaderDTO.getLabTestDetailsList().forEach(labTestDetailDTO -> {
                        LabTestDetails testDetails = labRegistrationMapper.labTestDetailsDTOToLabTestDetails(labTestDetailDTO);
                        testDetails.setActiveInd(1);
                        testDetails.setServiceId(finalTestHeader.getServiceId());
                        testDetails.setTestHeaderId(finalTestHeader.getId());
                        testDetails.setRegistrationId(finalLabRegistrationEntity.getId());
                        labTestDetailsRepository.save(testDetails);
                    });
                });

                return new MasterManagerResponse(MasterConstant.DATA_SAVED, getDetailByRegistrationId(labRegistrationEntity.getId()));
            } else {
                throw new MasterManagerException(MasterConstant.NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("LabRegistrationService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private static LabRegistration getLabRegistration(LabRegistrationDTO reqDomain, Optional<LabRegistration> labRegistrationOptional) {
        LabRegistration labRegistrationEntity = labRegistrationOptional.get();
        if (Objects.nonNull(reqDomain.getAppointmentId())) {
            labRegistrationEntity.setAppointment(new Appointment(reqDomain.getAppointmentId()));
        }
        if (Objects.nonNull(reqDomain.getLabNumber())) {
            labRegistrationEntity.setLabNumber(reqDomain.getLabNumber());
        }
        if (Objects.nonNull(reqDomain.getPatientId())) {
            labRegistrationEntity.setPatientId(reqDomain.getPatientId());
        }
        if (Objects.nonNull(reqDomain.getSampleCollectedTime())) {
            labRegistrationEntity.setSampleCollectedTime(reqDomain.getSampleCollectedTime());
        }
        if (Objects.nonNull(reqDomain.getReportGenerated())) {
            labRegistrationEntity.setReportGenerated(reqDomain.getReportGenerated());
        }
        if (Objects.nonNull(reqDomain.getSampleCollected())) {
            labRegistrationEntity.setSampleCollected(reqDomain.getSampleCollected());
        }
        if (Objects.nonNull(reqDomain.getStatus())) {
            labRegistrationEntity.setStatus(reqDomain.getStatus());
        }

        if (Objects.nonNull(reqDomain.getApprovalStatus())) {
            labRegistrationEntity.setApprovalStatus(reqDomain.getApprovalStatus());
        }

        if (Objects.nonNull(reqDomain.getApprovedBy())) {
            labRegistrationEntity.setApprovedBy(reqDomain.getApprovedBy());
        }

        if (Objects.nonNull(reqDomain.getApprovalNote())) {
            labRegistrationEntity.setApprovalNote(reqDomain.getApprovalNote());
        }

        if (Objects.nonNull(reqDomain.getApprovalDate())) {
            labRegistrationEntity.setApprovalDate(reqDomain.getApprovalDate());
        }

        labRegistrationEntity.setActiveInd(1);
        return labRegistrationEntity;
    }


    private LabRegistrationDTO getDetailByRegistrationId(Integer id) {
        Optional<LabRegistration> labRegistrationOptional = labRegistrationRepository.findById(id);
        if (labRegistrationOptional.isPresent()) {

            LabRegistrationDTO labRegistrationDTO = labRegistrationMapper.labRegistrationToLabRegistrationDTO(labRegistrationOptional.get());

            List<LabTestHeader> labTestHeaderList = labTestHeaderRepository.findByRegistrationId(labRegistrationDTO.getId());

            Appointment appointment = labRegistrationOptional.get().getAppointment();
            if (Objects.nonNull(appointment)) {
                labRegistrationDTO.setRegistrationNumber(appointment.getDocumentNumber());
                labRegistrationDTO.setLastName(appointment.getLastName());
                labRegistrationDTO.setFirstName(appointment.getFirstName());
                labRegistrationDTO.setMobileNumber(appointment.getMobileNumber());
                labRegistrationDTO.setDob(appointment.getDob());
                labRegistrationDTO.setGender(appointment.getGender());
                labRegistrationDTO.setPaymentStatus(appointment.getPaymentStatus());
                labRegistrationDTO.setAppointmentId(appointment.getId());
                Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(appointment.getEmployeeId());
                employeeOptional.ifPresent(employee -> labRegistrationDTO.setDoctorName(employee.getFirstName() + " " + employee.getLastName()));
            }

            List<LabTestHeaderDTO> labTestHeaderDTOList = new ArrayList<>();
            labTestHeaderList.forEach(labTestHeader -> {
                LabTestHeaderDTO testHeaderDTO = labRegistrationMapper.labTestHeaderToLabTestHeaderDTO(labTestHeader);
                testHeaderDTO.setType(labRegistrationDTO.getType());
                if (Objects.nonNull(testHeaderDTO.getServiceId())) {
                    Optional<PathologyTests> pathologyTestsOptional = pathologyTestsRepository.findById(testHeaderDTO.getServiceId());
                    if (pathologyTestsOptional.isPresent()) {
                        PathologyTests pathologyTests = pathologyTestsOptional.get();
                        testHeaderDTO.setServiceName(pathologyTests.getName());
                        testHeaderDTO.setTestType(pathologyTests.getType());
                        testHeaderDTO.setDescription(pathologyTests.getDescription());
                    }

                    List<LabTestDetails> labTestDetailsList = labTestDetailsRepository.findByTestHeaderId(labTestHeader.getId());
                    List<LabTestDetailDTO> labTestDetailDTOList = new ArrayList<>();
                    labTestDetailsList.forEach(labTestDetails -> {
                        LabTestDetailDTO labTestDetailDTO = labRegistrationMapper.labTestDetailsToLabTestDetailsDTO(labTestDetails);
                        if (Objects.nonNull(labTestDetailDTO.getServiceDetailedId())) {
                            Optional<PathologyTestDetails> pathologyTestsDetailsOptional = pathologyTestDetailsRepository.findById(labTestDetailDTO.getServiceDetailedId());
                            if (pathologyTestsDetailsOptional.isPresent()) {
                                PathologyTestDetails ptd = pathologyTestsDetailsOptional.get();
                                labTestDetailDTO.setServiceDetailedName(ptd.getName());
                                labTestDetailDTO.setFormula(ptd.getFormula());
                                labTestDetailDTO.setUnitName(ptd.getUnitName());
                                labTestDetailDTO.setMethodDesc(ptd.getMethodDesc());

                                if ("F".equals(labRegistrationDTO.getGender())) {
                                    labTestDetailDTO.setNormalMax(ptd.getFemaleNormalRangeMax());
                                    labTestDetailDTO.setNormalMin(ptd.getFemaleNormalRangeMin());
                                    labTestDetailDTO.setDescriptiveRange(ptd.getDescriptiveRangeF());
                                } else {
                                    labTestDetailDTO.setNormalMax(ptd.getMaleNormalRangeMax());
                                    labTestDetailDTO.setNormalMin(ptd.getMaleNormalRangeMin());
                                    labTestDetailDTO.setDescriptiveRange(ptd.getDescriptiveRangeM());
                                }


                                List<PathologyTestsAgeRange> pathologyTestsAgeRanges = pathologyTestAgeRangeRepository.findByPathalogyTestDtlId(ptd.getId());
                                if(!CollectionUtils.isEmpty(pathologyTestsAgeRanges) && Objects.nonNull(labRegistrationDTO.getDob())) {
                                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                                    Date date = labRegistrationDTO.getDob();
                                    //Converting obtained Date object to LocalDate object
                                    Instant instant = date.toInstant();
                                    ZonedDateTime zone = instant.atZone(ZoneId.systemDefault());
                                    LocalDate givenDate = zone.toLocalDate();
                                    //Calculating the difference between given date to current date.
                                    Period period = Period.between(givenDate, LocalDate.now());

                                    Optional<PathologyTestsAgeRange> pathologyTestsAgeRangeOptional = pathologyTestsAgeRanges.stream().filter(dto -> period.getDays() <= dto.getAgeMax() && period.getDays() >= dto.getAgeMin()).findFirst();

                                    if (pathologyTestsAgeRangeOptional.isPresent()) {
                                        PathologyTestsAgeRange ptar = pathologyTestsAgeRangeOptional.get();
                                        if ("F".equals(labRegistrationDTO.getGender())) {
                                            labTestDetailDTO.setNormalMax(ptar.getFemaleNormalRangeMax());
                                            labTestDetailDTO.setNormalMin(ptar.getFemaleNormalRangeMin());
                                            labTestDetailDTO.setDescriptiveRange(ptar.getDescriptiveRangeF());
                                        } else {
                                            labTestDetailDTO.setNormalMax(ptar.getMaleNormalRangeMax());
                                            labTestDetailDTO.setNormalMin(ptar.getMaleNormalRangeMin());
                                            labTestDetailDTO.setDescriptiveRange(ptar.getDescriptiveRangeM());
                                        }
                                    }
                                }
                            }
                        }
                        labTestDetailDTO.setType(labRegistrationDTO.getType());
                        labTestDetailDTOList.add(labTestDetailDTO);
                    });
                    testHeaderDTO.setLabTestDetailsList(labTestDetailDTOList);
                    labTestHeaderDTOList.add(testHeaderDTO);
                }
            });
            labRegistrationDTO.setLabTestHeaderList(labTestHeaderDTOList);


            return labRegistrationDTO;
        } else {
            return new LabRegistrationDTO();
        }
    }

    @Transactional
    public MasterManagerResponse updateStatus(LabRegistrationStatusDTO labRegistrationStatusDTO) {

        Optional<LabRegistration> labRegistrationOptional = labRegistrationRepository.findById(labRegistrationStatusDTO.getId());
        if (labRegistrationOptional.isPresent()) {
            LabRegistration labRegistration = labRegistrationOptional.get();

            if (Objects.nonNull(labRegistrationStatusDTO.getApprovalStatus())) {
                labRegistration.setApprovalStatus(labRegistrationStatusDTO.getApprovalStatus());
                if ("A".equalsIgnoreCase(labRegistration.getApprovalStatus())) {
                    labRegistration.setApprovalDate(new Date());
                    labRegistration.setApprovedBy(UserContext.getCurrentUser());
                }
            }

            if (Objects.nonNull(labRegistrationStatusDTO.getApprovedBy())) {
                labRegistration.setApprovedBy(labRegistrationStatusDTO.getApprovedBy());
            }

            if (Objects.nonNull(labRegistrationStatusDTO.getApprovalNote())) {
                labRegistration.setApprovalNote(labRegistrationStatusDTO.getApprovalNote());
            }

            if (Objects.nonNull(labRegistrationStatusDTO.getApprovalDate())) {
                labRegistration.setApprovalDate(labRegistrationStatusDTO.getApprovalDate());
            }

            if (Objects.nonNull(labRegistrationStatusDTO.getLabNumber())) {
                labRegistration.setLabNumber(labRegistrationStatusDTO.getLabNumber());
            }
            if (Objects.nonNull(labRegistrationStatusDTO.getStatus())) {
                labRegistration.setStatus(labRegistrationStatusDTO.getStatus());
            }
            if (Objects.nonNull(labRegistrationStatusDTO.getReportGenerated())) {
                labRegistration.setReportGenerated(labRegistrationStatusDTO.getReportGenerated());
            }
            if (Objects.nonNull(labRegistrationStatusDTO.getSampleCollected())) {
                labRegistration.setSampleCollected(labRegistrationStatusDTO.getSampleCollected());
            }

        }
        return new MasterManagerResponse(MasterConstant.DATA_MODIFY, getDetailByRegistrationId(labRegistrationStatusDTO.getId()));
    }
}
