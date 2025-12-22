package com.verAuto.orderTracking.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoleResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Integer roleId;
    private String roleName;
    private String assignedAt;
}
