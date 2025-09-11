package com.codecraft.master.repositories;

import com.codecraft.master.entities.GTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface GTemplateRepository extends JpaRepository<GTemplate, Integer>, JpaSpecificationExecutor<GTemplate> {
   
    @Query("SELECT g FROM GTemplate g WHERE g.id = :id")
    Optional<GTemplate> findById(@Param("id") Integer id);



}