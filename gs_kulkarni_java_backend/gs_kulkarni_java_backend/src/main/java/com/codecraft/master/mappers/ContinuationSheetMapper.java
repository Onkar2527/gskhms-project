
package com.codecraft.master.mappers;

import com.codecraft.master.entities.ContinuationSheet;
import com.codecraft.master.models.ContinuationSheetDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class ContinuationSheetMapper {

    public abstract ContinuationSheetDTO continuationSheetToContinuationSheetDTO(ContinuationSheet source);

    public abstract ContinuationSheet continuationSheetDTOToContinuationSheet(ContinuationSheetDTO source);
}