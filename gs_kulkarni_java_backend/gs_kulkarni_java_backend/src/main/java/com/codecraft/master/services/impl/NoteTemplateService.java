package com.codecraft.master.services.impl;

import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.NoteTemplate;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.repositories.NoteTemplateRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class NoteTemplateService {

    @Autowired
    NoteTemplateRepository noteTemplateRepository;

    public MasterManagerResponse search(NoteTemplate reqDomain) {
        log.info("NoteTemplateService : search() started reqDomain {}", reqDomain);
        try {
            List<NoteTemplate> noteTemplatesList = noteTemplateRepository.findAll();
            return new MasterManagerResponse(MasterConstant.SUCCESS, noteTemplatesList);
        } catch (Exception e) {
            log.error("NoteTemplateService : search() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse save(NoteTemplate reqDomain) {
        log.info("NoteTemplateService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);

            return new MasterManagerResponse(MasterConstant.DATA_SAVED, noteTemplateRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("NoteTemplateService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public MasterManagerResponse update(NoteTemplate reqDomain) {
        log.info("NoteTemplateService : save() started reqDomain {}", reqDomain);
        try {
            reqDomain.setActiveInd(1);

            return new MasterManagerResponse(MasterConstant.DATA_SAVED, noteTemplateRepository.save(reqDomain));
        } catch (Exception e) {
            log.error("NoteTemplateService : save() Exception occurred while fetching user details", e);
            throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
