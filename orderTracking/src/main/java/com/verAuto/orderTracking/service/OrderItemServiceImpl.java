package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.OrderItemDAO;
import com.verAuto.orderTracking.entity.OrderItem;
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
    public List<OrderItem> findByCompanyName(String companyName) {
        Optional<List<OrderItem>> result = Optional.ofNullable(orderItemDAO.findByCompanyName(companyName));
        List<OrderItem> orderItems = null;
        if(result.isPresent()) {
            orderItems = result.get();
        } else {
            throw new RuntimeException("Did not find employee " + companyName);
        }
        return orderItems;
    }

    @Override
    public List<OrderItem> findByDestination(String destination) {
        return List.of();
    }

    @Override
    public List<OrderItem> findByRegistrationNumber(String registrationNumber) {
        return List.of();
    }

    @Override
    public OrderItem findById(int id) {
        return null;
    }

    @Override
    public OrderItem save(OrderItem orderItem) {
        return null;
    }

    @Override
    public void deleteById(int id) {

    }
}
