package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.CreateOrderRequest;
import com.verAuto.orderTracking.entity.*;
import com.verAuto.orderTracking.enums.OrderStatus;
import com.verAuto.orderTracking.service.CarModelService;
import com.verAuto.orderTracking.service.CityService;
import com.verAuto.orderTracking.service.CompanyService;
import com.verAuto.orderTracking.service.OrderItemService;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<List<OrderItem>> getAllOrders(@AuthenticationPrincipal User user) {
        List<OrderItem> orders = orderItemService.findAll(user);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/city")
    public ResponseEntity<List<OrderItem>> getAllUserOrder(@AuthenticationPrincipal User user) {

        List<OrderItem> orders =   orderItemService.findUserOrders(user);;
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<OrderStatus, Long>> getOrdersCount(@AuthenticationPrincipal User user) {

        return new ResponseEntity<>(orderItemService.getStatusCounts(user), HttpStatus.OK);
    }

    @GetMapping("/status")
    public ResponseEntity<Page<OrderItem>> getOrdersByStatus(
            @RequestParam OrderStatus status
            ,@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
            , @AuthenticationPrincipal User user
    ) {
        Page<OrderItem> ordersPage = orderItemService.findOrderByStatus(status, user, page, size);
        return new ResponseEntity<>(ordersPage, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderById(@PathVariable Long id) {
        return new ResponseEntity<>(orderItemService.findById(id), HttpStatus.OK);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<OrderItem> createOrder(
            @RequestPart("data") CreateOrderRequest request,
            @RequestPart(value = "images", required = false) MultipartFile[] files, // Changed to array
            @AuthenticationPrincipal User user) {

        // 1. Fetch dependencies
        CarModel model = carModelService.findById(request.getCarModelId());
        Company company = companyService.findById(request.getCompanyId());
        City city = cityService.findCityById(request.getCityId());

        // 2. Map DTO to Entity
        OrderItem orderItem = request.getOrderItem();
        orderItem.setId(null); // Ensure new record
        orderItem.setCity(city);
        orderItem.setCarModel(model);
        orderItem.setCompany(company);
        orderItem.setStatus(OrderStatus.PENDING);

        // 3. Save Order and Images via Service
        // We pass the files array directly to the service
        OrderItem createdOrder = orderItemService.save(orderItem, user, files);

        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderItem> updateStatus(
            @PathVariable Long id, @RequestParam OrderStatus status,
            @AuthenticationPrincipal User user) {
        // 1. Fetch existing order
        // 3. Save (The other fields remain untouched in Java memory)
        OrderItem savedOrder = orderItemService.updateStatus(id, status, user);

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
