package com.codecraft.master.repositories;

import com.codecraft.master.entities.Department;
import com.codecraft.master.entities.SubDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubDepartmentRepository extends JpaRepository<SubDepartment, Integer> {
    List<SubDepartment> findByDeptId(Integer deptId);
}
