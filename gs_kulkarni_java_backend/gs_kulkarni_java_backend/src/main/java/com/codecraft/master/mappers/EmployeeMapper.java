
package com.codecraft.master.mappers;

import com.codecraft.master.entities.Employee;
import com.codecraft.master.models.EmployeeDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class EmployeeMapper {

    public abstract EmployeeDTO employeeToEmployeeDTO(Employee source);

    public abstract Employee employeeDTOToEmployee(EmployeeDTO source);
}