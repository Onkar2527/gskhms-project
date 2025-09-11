package com.codecraft.master.repositories;

import com.codecraft.master.entities.Employee;
import com.codecraft.master.entities.UploadDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UploadDocumentRepository extends JpaRepository<UploadDocument, Integer> {
    void deleteByDocId(Integer docId);

    List<UploadDocument> findAllByHospitalId(int hospitalId);
}
