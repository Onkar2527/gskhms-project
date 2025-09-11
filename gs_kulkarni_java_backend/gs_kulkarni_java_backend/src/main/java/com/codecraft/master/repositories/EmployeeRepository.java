package com.codecraft.master.repositories;

import com.codecraft.master.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> , JpaSpecificationExecutor<Employee> {
    Optional<Employee> findByEmailId(String username);

    List<Employee> findByHospitalId(int hospitalId);

    Optional<Employee> findByEmployeeId(Integer employeeId);
}
