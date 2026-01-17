package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.WindowDetailsDTO;
import com.verAuto.orderTracking.entity.WindowDetails;

import java.util.List;

public interface WindowDetailsService {
    List<WindowDetailsDTO> getAllWinodwDetails();
    List<WindowDetails> getWindowDetailsByOrderId(long orderId);
    List<WindowDetailsDTO> saveWindowsDetails(List<WindowDetailsDTO> windowDetails);
    void deleteWindowDetails(WindowDetailsDTO windowDetailsDTO);
}
