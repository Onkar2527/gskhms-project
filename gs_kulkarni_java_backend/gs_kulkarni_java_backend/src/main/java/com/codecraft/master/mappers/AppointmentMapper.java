
package com.codecraft.master.mappers;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.models.AppointmentDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public abstract class AppointmentMapper {

    public abstract AppointmentDTO appointmentToAppointmentDTO(Appointment source);

    public abstract Appointment appointmentDTOToAppointment(AppointmentDTO source) ;

    public abstract Patient appointmentToPatient(Appointment source) ;
}
