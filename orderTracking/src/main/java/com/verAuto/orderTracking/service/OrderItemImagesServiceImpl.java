package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CreatOrderImage;
import com.verAuto.orderTracking.dao.OrderImageDAO;
import com.verAuto.orderTracking.dao.OrderItemDAO;
import com.verAuto.orderTracking.entity.OrderImage;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderItemImagesServiceImpl implements OrderItemImagesService{
    @Value("${file.upload-dir}")
    private String uploadPath;
    private final OrderImageDAO orderImageDAO;
    private final OrderItemDAO orderItemDAO;
    @Autowired
    public  OrderItemImagesServiceImpl(OrderImageDAO orderImageDAO, OrderItemDAO orderItemDAO) {
        this.orderImageDAO = orderImageDAO;
        this.orderItemDAO = orderItemDAO;
    }

    @Override
    public List<OrderImage> findAll() {
        return orderImageDAO.findAll();
    }

    @Override
    public List<OrderImage> findImagesByOrderId(Long orderId) {
        return orderImageDAO.findByOrderItemId(orderId);
    }

    @Override
    public OrderImage findImageById(Long id) {
        return orderImageDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("could not find the image with the id - " + id));
    }

    @Override
    public List<OrderImage> saveImages(MultipartFile[] files, OrderItem orderItem) throws IOException {
        List<OrderImage> savedImages = new ArrayList<>();

        // 1. Create directory if it doesn't exist
        Path root = Paths.get(uploadPath);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        for (MultipartFile file : files) {
            // 2. Generate a unique filename to prevent overwriting
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // 3. Save the physical file to the disk
            Files.copy(file.getInputStream(), root.resolve(fileName));

            // 4. Create the Database Entity
            OrderImage image = new OrderImage();
            image.setUrl("/" + uploadPath + "/" + fileName);
            image.setOrderItem(orderItem);

            savedImages.add(orderImageDAO.save(image));
        }

        return savedImages;
    }


    @Override
    public void deleteByOrderItemId(Long id) {
        OrderItem orderItem = orderItemDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("could not find order with the id - " + id));
        orderImageDAO.deleteByOrderItemId(orderItem.getId());
    }

    @Override
    public void deleteImageById(Long id) {
        boolean exists = orderImageDAO.existsById(id);
        if(exists) {
            throw new RuntimeException("image with ID " + id + " does not exist");
        }

        orderImageDAO.deleteById(id);
    }
}
