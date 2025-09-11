
package com.codecraft.master.mappers;

import com.codecraft.master.entities.CasualityDetail;
import com.codecraft.master.models.CasualityDetailDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class CasualityDetailsMapper {

    public abstract CasualityDetailDTO casualityDetailToCasualityDetailDTO(CasualityDetail source);

    public abstract CasualityDetail casualityDetailDTOToCasualityDetails(CasualityDetailDTO source);
}