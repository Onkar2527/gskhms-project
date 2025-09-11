
package com.codecraft.master.mappers;

import com.codecraft.master.entities.Bed;
import com.codecraft.master.entities.ClinicalAssessment;
import com.codecraft.master.models.BedDTO;
import com.codecraft.master.models.ClinicalAssessmentDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class ClinicalAssessmentMapper {

    public abstract ClinicalAssessmentDTO clinicalAssessmentToClinicalAssessmentDTO(ClinicalAssessment source);

    public abstract ClinicalAssessment clinicalAssessmentDTOToClinicalAssessment(ClinicalAssessmentDTO source);
}