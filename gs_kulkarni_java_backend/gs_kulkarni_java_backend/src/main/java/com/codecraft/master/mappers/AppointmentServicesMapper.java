
package com.codecraft.master.mappers;

import com.codecraft.master.entities.AppointmentServiceEntity;
import com.codecraft.master.models.AppointmentDTO;
import com.codecraft.master.models.AppointmentServiceDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class AppointmentServicesMapper {

    public abstract AppointmentServiceDTO appointmentServicesToAppointmentServiceDTO(AppointmentServiceEntity source);

    public abstract AppointmentServiceEntity appointmentServicesDTODTOToAppointmentServiceEntity(AppointmentDTO source) ;

}
