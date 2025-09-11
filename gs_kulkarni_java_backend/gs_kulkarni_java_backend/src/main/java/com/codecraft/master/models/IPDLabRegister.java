package com.codecraft.master.models;

import com.codecraft.master.entities.AppointmentServiceEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IPDLabRegister {

    Integer appointmentId;
    Integer patientId;
    List<AppointmentServiceEntity> appointmentServices;

}
