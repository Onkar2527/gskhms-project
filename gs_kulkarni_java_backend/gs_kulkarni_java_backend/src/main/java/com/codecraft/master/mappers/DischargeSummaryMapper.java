
package com.codecraft.master.mappers;

import com.codecraft.master.entities.DischargeSummary;
import com.codecraft.master.models.DischargeSummaryDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class DischargeSummaryMapper {

    public abstract DischargeSummaryDTO dischargeSummaryToDischargeSummaryDTO(DischargeSummary source);

    public abstract DischargeSummary dischargeSummaryDTOToDischargeSummary(DischargeSummaryDTO source);
}