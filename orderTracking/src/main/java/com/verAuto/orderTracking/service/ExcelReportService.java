package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.OrderItem;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ExcelReportService {
    ByteArrayInputStream exportOrdersToExcel(List<OrderItem> orders);
}
