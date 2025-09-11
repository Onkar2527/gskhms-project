
package com.codecraft.master.mappers;

import com.codecraft.master.entities.MedicationOrderSheet;
import com.codecraft.master.models.MedicationOrderSheetDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class MedicationOrderSheetMapper {

    public abstract MedicationOrderSheetDTO medicationOrderSheetToMedicationOrderSheetDTO(MedicationOrderSheet source);

    public abstract MedicationOrderSheet medicationOrderSheetDTOToMedicationOrderSheet(MedicationOrderSheetDTO source);
}