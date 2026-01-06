package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UserDTO {
    private String password;
    private String email;
    private String username;
    private long cityId;
    private List<Role> roles = new ArrayList<>();
    private List<Company> companies = new ArrayList<>();
    private boolean status = false;
}
