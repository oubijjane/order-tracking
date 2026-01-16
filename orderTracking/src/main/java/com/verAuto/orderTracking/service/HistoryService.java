package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.HistoryDTO;
import com.verAuto.orderTracking.entity.History;

import java.util.List;

public interface HistoryService {
    List<HistoryDTO> getOrderHistory(long id);
    History addNewHistory(HistoryDTO historyDTO);
    void deleteHistoryByOrderId(long id);
}
