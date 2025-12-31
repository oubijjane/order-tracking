package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CityDAO;
import com.verAuto.orderTracking.dao.OrderItemDAO;
import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserCompany;
import com.verAuto.orderTracking.enums.OrderStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;



@Service
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemImagesService orderItemImagesService;
    private final OrderItemDAO orderItemDAO;
    private final CityDAO cityDAO ;


    @Autowired
    public OrderItemServiceImpl (OrderItemDAO orderItemDAO,
                                 CityDAO cityDAO,
                                 OrderItemImagesService orderItemImagesService) {
        this.orderItemDAO = orderItemDAO;
        this.cityDAO = cityDAO;
        this.orderItemImagesService = orderItemImagesService;
    }

    @Override
    public List<OrderItem> findAll(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());

       if (roleNames.contains("ROLE_GARAGISTE")) {
            // Assuming User entity has a 'city' field
            Long id = user.getCity().getId();
            City city = cityDAO.findById(id)
                    .orElseThrow(() -> new RuntimeException("could not find a city with the id - " + id));
            return orderItemDAO.findByCity(city);
        }
        if (roleNames.contains("ROLE_GESTIONNAIRE")) {
            // Assuming User entity has a 'city' field
            Set<UserCompany> userCompanies = user.getCompanies();
            List<Long> companyIds = userCompanies.stream()
                    .map(uc -> uc.getCompany().getId()) // Get the ID from the Company inside UserCompany
                    .toList();      // Turn it into a List
            return orderItemDAO.findAllByCompanyIds(companyIds);
        }
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
    public Map<OrderStatus, Long> getStatusCounts(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());
        List<Object[]> results;
        if (roleNames.contains("ROLE_GARAGISTE")) {
            results = orderItemDAO.countOrdersByStatusAndCity(user.getCity());
        } else if (roleNames.contains("ROLE_GESTIONNAIRE")) {
            // Filter by the companies assigned to this user
            List<Long> companyIds = user.getCompanies().stream()
                    .map(uc -> uc.getCompany().getId())
                    .collect(Collectors.toList());
            results = orderItemDAO.countOrdersByStatusAndCompanies(companyIds);

        }else {

            results = orderItemDAO.countOrdersByStatusRaw();
        }
        Map<OrderStatus, Long> counts = new HashMap<>();

        // Initialize all statuses to 0 so the UI doesn't break
        for (OrderStatus s : OrderStatus.values()) {
            counts.put(s, 0L);
        }

        // Fill with real data
        for (Object[] result : results) {
            counts.put((OrderStatus) result[0], (Long) result[1]);
        }
        return counts;
    }

    @Override
    public Page<OrderItem> findOrderByStatus(OrderStatus status, User user, int page, int size) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());

        // 1. Create the pageable object once
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        // 2. Branch logic for different roles
        if (roleNames.contains("ROLE_GARAGISTE")) {
            return orderItemDAO.findByStatusAndCity(status, user.getCity(), pageable);
        }

        if (roleNames.contains("ROLE_GESTIONNAIRE")) {
            List<Long> companyIds = user.getCompanies().stream()
                    .map(uc -> uc.getCompany().getId())
                    .toList();
            // Now passing pageable here
            return orderItemDAO.findByStatusAndCompanies(status, companyIds, pageable);
        }

        // Default case (e.g. ROLE_ADMIN): Now passing pageable here
        return orderItemDAO.findByStatus(status, pageable);
    }

    @Override
    public OrderItem findById(Long id) {
        return orderItemDAO.findById(id) // This already returns Optional<OrderItem>
                .orElseThrow(() -> new RuntimeException("Did not find order number - " + id));
    }

    @Override
    public List<OrderItem> findUserOrders(User user) {
        Long id = user.getCity().getId();
        City city = cityDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("could not find the city with the id - " + id));
        return orderItemDAO.findByCity(city);
    }

    @Override
    @Transactional // Ensures both Order and Images save or both fail
    public OrderItem save(OrderItem orderItem, User user, MultipartFile[] files) {
        // 1. Associate the user and save the Order first (to get the ID)
        orderItem.setUser(user);
        OrderItem savedOrder = orderItemDAO.save(orderItem);

        // 2. If there are images, delegate to ImageService
        if (files != null && files.length > 0) {
            try {
                orderItemImagesService.saveImages(files, savedOrder);
            } catch (IOException e) {
                // Throwing a RuntimeException triggers the @Transactional rollback
                throw new RuntimeException("Failed to store images, rolling back order creation", e);
            }
        }

        return savedOrder;
    }

    @Override
    public OrderItem updateStatus(Long id, OrderStatus newStatus, User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());
        OrderItem existingOrder = findById(id);
        OrderStatus currentStatus = existingOrder.getStatus();
        System.out.println("new Status " + newStatus + " " + "curreent status " + currentStatus);

        validateStatusTransition(currentStatus, newStatus);

        // --- RULE 1: Garagiste & Gestionnaire Restrictions ---
        // These roles can ONLY move an order to specific statuses (e.g., 'CANCELLED' or 'PENDING')
        if (roleNames.contains("ROLE_GARAGISTE") || roleNames.contains("ROLE_GESTIONNAIRE")) {
            List<OrderStatus> forbiddenForThem = Arrays.asList(
                    OrderStatus.AVAILABLE,
                    OrderStatus.IN_PROGRESS,
                    OrderStatus.NOT_AVAILABLE
            );

            if (forbiddenForThem.contains(newStatus)) {
                throw new RuntimeException("Role " + roleNames + " is not allowed to set status to " + newStatus);
            }
        }

        // --- RULE 2: Logisticien Restrictions ---
        if (roleNames.contains("ROLE_LOGISTICIEN")) {
            if (newStatus == OrderStatus.SENT || newStatus == OrderStatus.CANCELLED) {
                throw new RuntimeException("Logisticians cannot mark orders as Sent or Cancelled.");
            }
        }
        existingOrder.setStatus(newStatus);
        return orderItemDAO.save(existingOrder);
    }

    @Override
    public void deleteById(Long id) {
        boolean exists = orderItemDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("Order with ID " + id + " does not exist");
        }
        orderItemDAO.deleteById(id);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        boolean isValid = switch (current) {
            case PENDING -> next == OrderStatus.IN_PROGRESS;
            case IN_PROGRESS -> next == OrderStatus.AVAILABLE || next == OrderStatus.NOT_AVAILABLE;
            case AVAILABLE -> next == OrderStatus.SENT || next == OrderStatus.CANCELLED;
            case NOT_AVAILABLE -> next == OrderStatus.AVAILABLE || next == OrderStatus.CANCELLED;
            case SENT -> next == OrderStatus.REPAIRED;
            default -> false;
        };

        if (!isValid) {
            throw new RuntimeException("Invalid transition: Cannot move order from " + current + " to " + next);
        }
    }
}
