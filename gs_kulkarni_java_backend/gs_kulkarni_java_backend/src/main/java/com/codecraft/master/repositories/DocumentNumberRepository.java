package com.codecraft.master.repositories;

import com.codecraft.master.entities.Bed;
import com.codecraft.master.entities.DocumentNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentNumberRepository extends JpaRepository<DocumentNumber, Integer>, JpaSpecificationExecutor<DocumentNumber> {
    List<Bed> findByHospitalId(Integer hospitalId);

    Optional<DocumentNumber> findByDocTypeAndSubDocTypeAndYearAndHospitalId(String docType, String subDocType, String year, Integer hospitalId);
}