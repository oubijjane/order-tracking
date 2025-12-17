package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.CreateOrderRequest;
import com.verAuto.orderTracking.entity.CarModel;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.enums.OrderStatus;
import com.verAuto.orderTracking.service.CarModelService;
import com.verAuto.orderTracking.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderItemController {
    private OrderItemService orderItemService;
    private CarModelService carModelService;

    @Autowired
    public OrderItemController(OrderItemService orderItemService, CarModelService carModelService) {
        this.orderItemService = orderItemService;
        this.carModelService = carModelService;
    }


    @GetMapping
    public ResponseEntity<List<OrderItem>> getAllOrders() {
        List<OrderItem> orders = orderItemService.findAll();

        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderById(@PathVariable Long id) {
        return new ResponseEntity<>(orderItemService.findById(id), HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<OrderItem> createOrder(@RequestBody CreateOrderRequest request) {
        CarModel model = carModelService.findById(request.getCarModelId());
        OrderItem orderItem = request.getOrderItem();
        orderItem.setId(null);
        orderItem.setCarModel(model);
        orderItem.setStatus(OrderStatus.PENDING);
        OrderItem createdOrder = orderItemService.save(orderItem);

        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);

    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> updateOrder(@PathVariable Long id, @RequestBody OrderItem orderItem) {

        OrderItem updatedOrder = orderItemService.findById(id);

        updatedOrder.setCarModel(orderItem.getCarModel());
        updatedOrder.setCompanyName(orderItem.getCompanyName());
        updatedOrder.setComment(orderItem.getComment());
        updatedOrder.setYear(orderItem.getYear());
        updatedOrder.setImage(orderItem.getImage());
        updatedOrder.setStatus(orderItem.getStatus());
        updatedOrder.setRegistrationNumber(orderItem.getRegistrationNumber());

        OrderItem savedOrder =  orderItemService.save(updatedOrder);

        return new ResponseEntity<>(savedOrder, HttpStatus.OK);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrderById(@PathVariable Long id) {
        orderItemService.deleteById(id);
        return new ResponseEntity<>("The order number " + id + " has successfully deleted", HttpStatus.NO_CONTENT);
    }

}
