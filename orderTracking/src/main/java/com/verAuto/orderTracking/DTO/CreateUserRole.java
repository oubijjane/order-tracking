package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.enums.CompanyAssignmentType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRole {
    private int roleId;
    private int userId;
}
