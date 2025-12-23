package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.OrderItemDAO;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemServiceImpl implements OrderItemService {
    private OrderItemDAO orderItemDAO;

    @Autowired
    public OrderItemServiceImpl (OrderItemDAO orderItemDAO) {
        this.orderItemDAO = orderItemDAO;
    }

    @Override
    public List<OrderItem> findAll() {
        return orderItemDAO.findAll();
    }


    @Override
    public List<OrderItem> findByRegistrationNumber(String registrationNumber) {
        List<OrderItem> orderItems = orderItemDAO.findByRegistrationNumber(registrationNumber);

        // 2. Check if the list is empty to trigger your error
        if (orderItems.isEmpty()) {

            throw new RuntimeException("Did not find orders for registrationNumber: " + registrationNumber);
        }

        return orderItems;
    }

    @Override
    public OrderItem updateOrderStatus(Long id, OrderStatus status) {
        OrderItem order = orderItemDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        return orderItemDAO.save(order);
    }

    @Override
    public OrderItem findById(Long id) {
        return orderItemDAO.findById(id) // This already returns Optional<OrderItem>
                .orElseThrow(() -> new RuntimeException("Did not find order number - " + id));
    }

    @Override
    public OrderItem save(OrderItem orderItem) {

        return orderItemDAO.save(orderItem);
    }

    @Override
    public void deleteById(Long id) {
        boolean exists = orderItemDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("Order with ID " + id + " does not exist");
        }
        orderItemDAO.deleteById(id);
    }
}
