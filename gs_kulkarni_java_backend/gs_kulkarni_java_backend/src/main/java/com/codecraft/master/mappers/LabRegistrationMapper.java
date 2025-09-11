
package com.codecraft.master.mappers;

import com.codecraft.master.entities.*;
import com.codecraft.master.models.AppointmentDTO;
import com.codecraft.master.models.LabRegistrationDTO;
import com.codecraft.master.models.LabTestDetailDTO;
import com.codecraft.master.models.LabTestHeaderDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class LabRegistrationMapper {

    public abstract LabRegistrationDTO labRegistrationToLabRegistrationDTO(LabRegistration source);
    public abstract LabRegistration labRegistrationDTOToLabRegistration(LabRegistrationDTO source);

    public abstract LabTestDetailDTO labTestDetailsToLabTestDetailsDTO(LabTestDetails source);
    public abstract LabTestDetails labTestDetailsDTOToLabTestDetails(LabTestDetailDTO source);

    public abstract LabTestHeaderDTO labTestHeaderToLabTestHeaderDTO(LabTestHeader source);
    public abstract LabTestHeader labTestHeaderDTOToLabTestHeader(LabTestHeaderDTO source);


}
