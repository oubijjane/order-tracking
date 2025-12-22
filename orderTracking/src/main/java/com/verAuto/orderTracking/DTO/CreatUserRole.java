package com.verAuto.orderTracking.DTO;

import com.verAuto.orderTracking.entity.Role;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatUserRole {
    private int roleId;
    private int userId;
}
