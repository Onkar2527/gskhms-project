package com.codecraft.master.repositories;

import com.codecraft.master.entities.Services;
import com.codecraft.master.models.ServiceData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ServicesRepository extends JpaRepository<Services, Integer> {
    List<Services> findByRateChangeApplicable(Boolean yes);

    List<Services> findByHospitalId(Integer hospitalId);


    Optional<Services> findByName(String serviceName);

//"select id,name,rate as charges, 'S' as type, other_yn as otherService from services s where s.hospital_id = :id" +

    @Query(value = " select id,name,charges, 'P' as type, 'N' as otherService from package_master pm where pm.hospital_id = :id" +
            " union all" +
            " select id,name,charges, type, 'N' as otherService from pathalogy_test pt where pt.hospital_id = :id",
            nativeQuery = true)
    List<ServiceData> getAll(Integer id);

    @Query(value = " select id, name, charges, 'P' as type, 'N' as otherService from package_master pm where pm.hospital_id = :id AND pm.package_type = :type" +
            " union all" +
            " select id, name, charges, type, 'N' as otherService from pathalogy_test pt where pt.hospital_id = :id AND pt.type = :type",
            nativeQuery = true)
    List<ServiceData> getAllByType(Integer id, String type);

    @Query("Select a.id from Services a where a.name IN :services")
    List<Integer> findByNameIn(List<String> services);
}