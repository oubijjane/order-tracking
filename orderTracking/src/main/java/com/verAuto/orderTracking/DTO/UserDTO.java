package com.verAuto.orderTracking.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private String password;
    private String email;
    private String username;
    private long cityId;
}
