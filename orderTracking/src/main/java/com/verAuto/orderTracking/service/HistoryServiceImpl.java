package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.HistoryDTO;
import com.verAuto.orderTracking.dao.HistoryDAO;
import com.verAuto.orderTracking.entity.History;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoryServiceImpl implements HistoryService{

    private final HistoryDAO historyDAO;



    @Autowired
    public HistoryServiceImpl(HistoryDAO historyDAO) {
        this.historyDAO = historyDAO;
    }

    @Override
    public List<HistoryDTO> getOrderHistory(long id) {
        return historyDAO.findHistoryByOrderId(id)
                .stream()
                .map(history -> {
                    HistoryDTO dto = new HistoryDTO();
                    dto.setCreateAt(history.getCreatedAt());
                    dto.setAction(history.getAction());
                    dto.setNewValue(history.getNewValue());
                    dto.setChangedBy(history.getChangedBy());
                    dto.setOldValue(history.getOldValue());
                    // Don't forget the user!
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public History addNewHistory(HistoryDTO historyDTO) {

        History history = new History();
        history.setOrder(historyDTO.getOrder());
        history.setChangedBy(historyDTO.getChangedBy());
        history.setAction(historyDTO.getAction());
        history.setOldValue(historyDTO.getOldValue());
        history.setNewValue(historyDTO.getNewValue());
        history.setId(null);

        return historyDAO.save(history);
    }

    @Override
    public void deleteHistoryByOrderId(long id) {
        historyDAO.deleteByOrderId(id);
    }
}
