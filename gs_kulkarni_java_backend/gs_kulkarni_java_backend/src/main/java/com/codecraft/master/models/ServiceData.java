package com.codecraft.master.models;

import lombok.Getter;
import lombok.Setter;

public interface ServiceData {

     Integer getId();
     String getName();
     Double getCharges();
     String getType();
     String getOtherService();

}