package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CreatOrderImage;
import com.verAuto.orderTracking.entity.OrderImage;
import com.verAuto.orderTracking.entity.OrderItem;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface OrderItemImagesService {
    List<OrderImage> findAll();
    List<OrderImage> findImagesByOrderId(Long orderId);
    OrderImage findImageById(Long id);
    List<OrderImage> saveImages(MultipartFile[] files, OrderItem orderItem) throws IOException;
    void deleteByOrderItemId(Long id);
    void deleteImageById(Long id);
}
