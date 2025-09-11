
package com.codecraft.master.mappers;

import com.codecraft.master.entities.NursingNotes;
import com.codecraft.master.models.NursingNotesDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class NursingNotesMapper {

    public abstract NursingNotesDTO nursingNotesToNursingNotesDTO(NursingNotes source);

    public abstract NursingNotes nursingNotesDTOToNursingNotes(NursingNotesDTO source);
}