package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.DeviceRequest;
import com.verAuto.orderTracking.dao.UserDeviceDAO;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserDevice;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final UserDeviceDAO repo;

    public DeviceController(UserDeviceDAO repo) {
        this.repo = repo;
    }

    @PostMapping
    public void saveDevice(@RequestBody DeviceRequest request,
                           @AuthenticationPrincipal User user) {

        String token = request.getToken();
        if (token == null || token.isEmpty()) return;

        // If device already exists for this token, update lastSeen and user
        List<UserDevice> existing = repo.findByToken(token);
        if (existing != null && !existing.isEmpty()) {
            existing.forEach(d -> {
                d.setUser(user);
                d.setLastSeen(Instant.now());
                repo.save(d);
            });
            return;
        }

        UserDevice device = new UserDevice();
        device.setUser(user);
        device.setToken(token);
        device.setLastSeen(Instant.now());

        repo.save(device);
    }

    @DeleteMapping
    @Transactional
    public void deleteDevice(@RequestParam("token") String token) {
        // remove all devices with provided token inside a transaction
        repo.deleteByToken(token);
    }
}
