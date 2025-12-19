package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.CreateOrderRequest;
import com.verAuto.orderTracking.entity.CarModel;
import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.enums.OrderStatus;
import com.verAuto.orderTracking.service.CarModelService;
import com.verAuto.orderTracking.service.CityService;
import com.verAuto.orderTracking.service.CompanyService;
import com.verAuto.orderTracking.service.OrderItemService;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderItemController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private OrderItemService orderItemService;
    private CarModelService carModelService;
    private CompanyService companyService;
    private CityService cityService;

    @Autowired
    public OrderItemController(
            OrderItemService orderItemService, CarModelService carModelService,
            CompanyService companyService, CityService cityService) {
        this.orderItemService = orderItemService;
        this.carModelService = carModelService;
        this.companyService = companyService;
        this.cityService = cityService;
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
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<OrderItem> createOrder(@RequestPart("data") CreateOrderRequest request, // The JSON
                                                 @RequestPart(value = "image", required = false) MultipartFile file) {

        // 1. Handle the File (Save it and get the path)
        String imagePath = "default.jpg";
        if (file != null && !file.isEmpty()) {
            try {
                // Save file logic (See helper method below)
                imagePath = saveFile(file);
            } catch (Exception e) {
                throw new RuntimeException("Error saving image", e);
            }
        }
        CarModel model = carModelService.findById(request.getCarModelId());
        Company company = companyService.findById(request.getCompanyId());
        City city = cityService.findCityById(request.getCityId());

        OrderItem orderItem = request.getOrderItem();
        orderItem.setCity(city);
        orderItem.setImage(imagePath);
        orderItem.setId(null);
        orderItem.setCarModel(model);
        orderItem.setCompany(company);
        orderItem.setStatus(OrderStatus.PENDING);
        OrderItem createdOrder = orderItemService.save(orderItem);

        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);

    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> updateOrder(@PathVariable Long id, @RequestBody OrderItem orderItem) {

        OrderItem updatedOrder = orderItemService.findById(id);

        updatedOrder.setCarModel(orderItem.getCarModel());
        updatedOrder.setCompany(orderItem.getCompany());
        updatedOrder.setComment(orderItem.getComment());
        updatedOrder.setYear(orderItem.getYear());
        updatedOrder.setImage(orderItem.getImage());
        updatedOrder.setStatus(orderItem.getStatus());
        updatedOrder.setRegistrationNumber(orderItem.getRegistrationNumber());

        OrderItem savedOrder =  orderItemService.save(updatedOrder);

        return new ResponseEntity<>(savedOrder, HttpStatus.OK);

    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderItem> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        // 1. Fetch existing order
        OrderItem order = orderItemService.findById(id);
        // 2. Modify ONLY the status
        order.setStatus(status);
        // 3. Save (The other fields remain untouched in Java memory)
        OrderItem savedOrder = orderItemService.save(order);

        return new ResponseEntity<>(savedOrder, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrderById(@PathVariable Long id) {
        orderItemService.deleteById(id);
        return new ResponseEntity<>("The order number " + id + " has successfully deleted", HttpStatus.NO_CONTENT);
    }

    private String saveFile(MultipartFile file) throws IOException {
        // Use the injected path
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

}
