
package com.codecraft.master.mappers;

import com.codecraft.master.entities.NursingAssessment;
import com.codecraft.master.models.NursingAssessmentDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class NursingAssessmentMapper {

    public abstract NursingAssessmentDTO nursingAssessmentToNursingAssessmentDTO(NursingAssessment source);

    public abstract NursingAssessment nursingAssessmentDTOToNursingAssessment(NursingAssessmentDTO source);
}