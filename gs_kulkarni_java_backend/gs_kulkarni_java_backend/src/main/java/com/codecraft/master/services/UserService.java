package com.codecraft.master.services;

import com.codecraft.master.entities.Employee;
import com.codecraft.master.models.EmployeeDTO;
import com.codecraft.master.models.MasterManagerResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    MasterManagerResponse search(Employee employee);

    MasterManagerResponse save(Employee employee);

    MasterManagerResponse update(String user, MultipartFile file);

    MasterManagerResponse delete(String userId);

    MasterManagerResponse validateUser(String email, String password);

    MasterManagerResponse getCurrentLoggedInUsers(Integer compId);

    MasterManagerResponse updatePassword(Integer employeeId, Employee employee);

    MasterManagerResponse save(String user, MultipartFile file);

    Employee loadUserByUsername(String userName);

    MasterManagerResponse updatePasswordByEmailId(Employee employee);

    MasterManagerResponse doctorSave(EmployeeDTO doctorDTO);

    MasterManagerResponse doctorUpdate(EmployeeDTO doctorDTO);
}
