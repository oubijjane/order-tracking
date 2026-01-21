package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.Role;
import com.verAuto.orderTracking.enums.CompanyAssignmentType;
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
    private List<Integer> roles = new ArrayList<>();
    private List<Long> companies = new ArrayList<>();
    private List<Long> secondaryCompanies = new ArrayList<>();
    private CompanyAssignmentType type;
    private boolean status;
}
