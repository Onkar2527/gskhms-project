package com.codecraft.master.models;

import com.codecraft.master.entities.Employee;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private long expiresIn;
    List<EmployeeLoginResponse> userList;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public List<EmployeeLoginResponse> getUserList() {
        return userList;
    }

    public void setUserList(List<EmployeeLoginResponse> userList) {
        this.userList = userList;
    }
}