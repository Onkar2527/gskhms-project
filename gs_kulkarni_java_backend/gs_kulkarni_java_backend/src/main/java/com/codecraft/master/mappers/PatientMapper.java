
package com.codecraft.master.mappers;

import com.codecraft.master.entities.Appointment;
import com.codecraft.master.entities.Patient;
import com.codecraft.master.models.PatientDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class PatientMapper {

    public abstract PatientDTO patientToPatientDTO(Patient source);

    public abstract Patient patientDTOToPatient(PatientDTO source);
}