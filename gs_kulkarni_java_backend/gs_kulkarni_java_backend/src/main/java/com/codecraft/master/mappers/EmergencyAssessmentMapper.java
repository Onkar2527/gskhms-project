
package com.codecraft.master.mappers;

import com.codecraft.master.entities.EmergencyAssessment;
import com.codecraft.master.models.EmergencyAssessmentDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class EmergencyAssessmentMapper {

    public abstract EmergencyAssessmentDTO emergencyAssessmentToEmergencyAssessmentDTO(EmergencyAssessment source);

    public abstract EmergencyAssessment emergencyAssessmentDTOToEmergencyAssessment(EmergencyAssessmentDTO source);
}