
package com.codecraft.master.mappers;

import com.codecraft.master.entities.CasualityHeader;
import com.codecraft.master.models.CasualityHeaderDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class CasualityHeaderMapper {

    public abstract CasualityHeaderDTO casualityHeaderToCasualityHeaderDTO(CasualityHeader source);

    public abstract CasualityHeader casualityHeaderDTOToCasualityHeader(CasualityHeaderDTO source);
}