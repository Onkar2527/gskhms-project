
package com.codecraft.master.mappers;

import com.codecraft.master.entities.PrescriptionDetailsAfter;
import com.codecraft.master.models.PrescriptionDetailsAfterDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class PrescriptionDetailsAfterMapper {

    public abstract PrescriptionDetailsAfterDTO prescriptionDetailsAfterToPrescriptionDetailsAfterDTO(PrescriptionDetailsAfter source);

    public abstract PrescriptionDetailsAfter prescriptionDetailsAfterDTOToPrescriptionDetailsAfter(PrescriptionDetailsAfterDTO source) ;
;
}
