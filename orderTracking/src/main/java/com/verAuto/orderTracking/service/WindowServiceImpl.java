package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.WindowDetailsDTO;
import com.verAuto.orderTracking.dao.OrderItemDAO;
import com.verAuto.orderTracking.dao.WindowDetailsDAO;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.entity.WindowDetails;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WindowServiceImpl implements WindowDetailsService{

    private final WindowDetailsDAO windowDetailsDAO;
    private final WindowBrandService windowBrandService;
    private final OrderItemDAO orderItemDAO;

    @Autowired
    public WindowServiceImpl(WindowDetailsDAO windowDetailsDAO, WindowBrandService windowBrandService, OrderItemDAO orderItemDAO) {
        this.windowDetailsDAO = windowDetailsDAO;
        this.windowBrandService = windowBrandService;
        this.orderItemDAO = orderItemDAO;
    }

    @Override
    public List<WindowDetailsDTO> getAllWindowDetails() {
        return windowDetailsDAO.findAll()
                .stream()
                .map(windowDetails ->{
                        WindowDetailsDTO dto = new WindowDetailsDTO();
                        dto.setId(windowDetails.getId());
                        dto.setWindowBrand(windowDetails.getWindowBrand().getWindowBrand());
                        dto.setOrderId(windowDetails.getOrder().getId());
                        dto.setPrice(windowDetails.getPrice());
                        dto.setWindowBrandId(windowDetails.getWindowBrand().getId());

                        return dto;
                        }
                ).collect(Collectors.toList());
    }

    @Override
    public List<WindowDetailsDTO> getWindowDetailsByOrderId(long orderId) {
        return windowDetailsDAO.getWindowDetailsByOrderId(orderId).stream()
                .map(windowDetails ->{
                            WindowDetailsDTO dto = new WindowDetailsDTO();
                            dto.setId(windowDetails.getId());
                            dto.setWindowBrand(windowDetails.getWindowBrand().getWindowBrand());
                            dto.setOrderId(windowDetails.getOrder().getId());
                            dto.setPrice(windowDetails.getPrice());
                            dto.setWindowBrandId(windowDetails.getWindowBrand().getId());

                            return dto;
                        }
                ).collect(Collectors.toList());
    }

    @Override
    public WindowDetails findById(Long id) {
        return windowDetailsDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("could not find window detail by id: " + id));
    }
    @Override
    @Transactional
    public List<WindowDetailsDTO> saveWindowsDetails(List<WindowDetailsDTO> windowDetailsDTOs) {
        // 1. Convert DTOs to Entities
        List<WindowDetails> entitiesToSave = windowDetailsDTOs.stream().map(dto -> {
            WindowDetails entity = new WindowDetails();
            entity.setWindowBrand(windowBrandService.findWindowBrandById(dto.getWindowBrandId()));
            entity.setPrice(dto.getPrice()); // Don't forget the price
            OrderItem orderItem = orderItemDAO.findById(dto.getOrderId()).orElseThrow(() -> new RuntimeException("could not find and order with the id - " + dto.getOrderId()));// !
            entity.setOrder(orderItem);
            return entity;
        }).collect(Collectors.toList());

        // 2. Save all in ONE database transaction
        List<WindowDetails> savedEntities = windowDetailsDAO.saveAll(entitiesToSave);

        // 3. Convert back to DTOs (Now with IDs from the database)
        return savedEntities.stream().map(entity -> {
            WindowDetailsDTO resultDTO = new WindowDetailsDTO();
            resultDTO.setId(entity.getId()); // React now has the ID!
            resultDTO.setWindowBrandId(entity.getWindowBrand().getId());
            resultDTO.setPrice(entity.getPrice());
            resultDTO.setOrderId(entity.getOrder().getId());
            resultDTO.setWindowBrandId(entity.getWindowBrand().getId());
            return resultDTO;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional // Required for delete/update operations
    public void deleteWindowDetails(WindowDetailsDTO windowDetailsDTO) {
        // 1. Mark the chosen offer as selected first
        WindowDetails selected = windowDetailsDAO.findById(windowDetailsDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Offre introuvable"));
      

        // 2. Now, delete all the "losers" in one query
        windowDetailsDAO.deleteByOrderIdAndIdNot(
                windowDetailsDTO.getOrderId(),
                windowDetailsDTO.getId()
        );
    }

    @Override
    public void deleteByOrderId(Long orderId) {
        windowDetailsDAO.deleteByOrderItemId(orderId);
    }

}
