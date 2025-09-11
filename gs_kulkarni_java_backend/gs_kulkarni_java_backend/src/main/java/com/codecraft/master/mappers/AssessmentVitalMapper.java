
package com.codecraft.master.mappers;

import com.codecraft.master.entities.AssessmentVital;
import com.codecraft.master.models.AssessmentVitalDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class AssessmentVitalMapper {

    public abstract AssessmentVitalDTO assessmentVitalToAssessmentVitalDTO(AssessmentVital source);

    public abstract AssessmentVital assessmentVitalDTOToAssessmentVital(AssessmentVitalDTO source);
}