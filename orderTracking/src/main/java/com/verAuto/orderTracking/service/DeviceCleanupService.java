package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.UserDeviceDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class DeviceCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(DeviceCleanupService.class);
    private final UserDeviceDAO deviceDAO;

    public DeviceCleanupService(UserDeviceDAO deviceDAO) {
        this.deviceDAO = deviceDAO;
    }

    // Runs every day at 3:00 AM
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void removeOldDevices() {
        int days = 30; // configurable default
        Instant threshold = Instant.now().minus(days, ChronoUnit.DAYS);
        logger.info("Cleaning up device tokens not seen since {}", threshold);
        deviceDAO.deleteByLastSeenBefore(threshold);
        logger.info("Device cleanup completed");
    }
}
