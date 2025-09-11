package com.codecraft.master.repositories;

import com.codecraft.master.entities.NoteTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteTemplateRepository extends JpaRepository<NoteTemplate, Integer>, JpaSpecificationExecutor<NoteTemplate> {
}