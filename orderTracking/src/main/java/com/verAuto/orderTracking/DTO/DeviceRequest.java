package com.verAuto.orderTracking.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DeviceRequest {
    private String token;
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
