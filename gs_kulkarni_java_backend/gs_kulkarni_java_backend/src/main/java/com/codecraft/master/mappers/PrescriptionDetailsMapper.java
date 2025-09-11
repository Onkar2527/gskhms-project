
package com.codecraft.master.mappers;

import com.codecraft.master.entities.PrescriptionDetails;
import com.codecraft.master.models.PrescriptionDetailsDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class PrescriptionDetailsMapper {

    public abstract PrescriptionDetailsDTO prescriptionDetailsToPrescriptionDetailsDTO(PrescriptionDetails source);

    public abstract PrescriptionDetails prescriptionDetailsDTOToPrescriptionDetails(PrescriptionDetailsDTO source) ;
;
}
