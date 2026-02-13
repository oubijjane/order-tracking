package com.verAuto.orderTracking.restController;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.verAuto.orderTracking.DTO.CreateOrderRequest;
import com.verAuto.orderTracking.DTO.HistoryDTO;
import com.verAuto.orderTracking.DTO.OrderItemDTO;
import com.verAuto.orderTracking.entity.*;
import com.verAuto.orderTracking.enums.OrderStatus;
import com.verAuto.orderTracking.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
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

    private final OrderItemService orderItemService;
    private final HistoryService historyService;
    private final ExcelReportService excelReportService;
    private final CarModelService carModelService;
    private final CompanyService companyService;
    private final CityService cityService;

    @Autowired
    public OrderItemController(
            OrderItemService orderItemService, HistoryService historyService, CarModelService carModelService,
            CompanyService companyService, CityService cityService, ExcelReportService excelReportService) {
        this.orderItemService = orderItemService;
        this.historyService = historyService;
        this.carModelService = carModelService;
        this.companyService = companyService;
        this.cityService = cityService;
        this.excelReportService = excelReportService;
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
    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportToExcel(  @AuthenticationPrincipal User user,
                                                               @RequestParam(required = false) String company,
                                                               @RequestParam(required = false) String city,
                                                               @RequestParam(required = false) String reg,
                                                               @RequestParam(required = false) String status) {

        // Reuse your optimized logic but without Pageable (to get ALL matching results)
        List<OrderItem> orders = orderItemService.findAllForReport(user, company,city, reg, status);

        ByteArrayInputStream in = excelReportService.exportOrdersToExcel(orders);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=orders_report.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
    @GetMapping("/filter")
    public ResponseEntity<Page<OrderItem>> filterOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String reg,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderItemService.findOrdersDynamic(user, company, city, reg, status, page, size));
    }

        @GetMapping("/user")
    public ResponseEntity<Page<OrderItem>> getUserOrder(@AuthenticationPrincipal User user,
                                                        @RequestParam(required = false) String company,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderItemService.findOrderItemByUserId(user, page, size));
    }

    @GetMapping("/grouped-orders/{id}")
    public ResponseEntity<List<OrderItemDTO>> getOrderByGroupId(@AuthenticationPrincipal User user,
                                                             @PathVariable Long id) {
        return ResponseEntity.ok(orderItemService.findByGroupId(user, id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderById(@AuthenticationPrincipal User user,@PathVariable Long id) {
        return new ResponseEntity<>(orderItemService.findByIdBasedOnRole(id, user), HttpStatus.OK);
    }



    @GetMapping("/{id}/history")
    public ResponseEntity<List<HistoryDTO>> getOrderHistory(@PathVariable Long id) {
        return new ResponseEntity<>(historyService.getOrderHistory(id), HttpStatus.OK);
    }


    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<OrderItem> createOrder(
            @RequestPart("data") CreateOrderRequest request,
            @RequestPart(value = "images", required = false) MultipartFile[] files, // Changed to array
            @AuthenticationPrincipal User user) {

        // 1. Fetch dependencies
        CarModel model = carModelService.findById(request.getCarModelId());
        Company company = companyService.findById(request.getCompanyId());


        // 2. Map DTO to Entity
        OrderItem orderItem = request.getOrderItem();
        orderItem.setId(null); // Ensure new record
        orderItem.setCarModel(model);
        orderItem.setCompany(company);
        orderItem.setStatus(OrderStatus.PENDING);

        // 3. Save Order and Images via Service
        // We pass the files array directly to the service
        OrderItem createdOrder = orderItemService.save(orderItem, user, files);

        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @PostMapping(
            value = "/create-orders",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<OrderItem>> createOrders(
            @RequestPart("data") List<CreateOrderRequest> requests,
            @RequestPart(value = "images", required = false) MultipartFile[] files, // Changed to array
            @AuthenticationPrincipal User user) {

        List<OrderItem> orders =  requests.stream().map( request -> {
            // 1. Fetch dependencies
            CarModel model = carModelService.findById(request.getCarModelId());
            Company company = companyService.findById(request.getCompanyId());


            // 2. Map DTO to Entity
            OrderItem orderItem = request.getOrderItem();
            orderItem.setId(null); // Ensure new record
            orderItem.setCarModel(model);
            orderItem.setCompany(company);
            orderItem.setStatus(OrderStatus.PENDING);

            return orderItem;
        }).toList();

        // 3. Save Order and Images via Service
        // We pass the files array directly to the service
        List<OrderItem> createdOrder = orderItemService.saveOrderWithMultiParts(orders, user, files);

        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }




    @PatchMapping("/{id}")
    public ResponseEntity<OrderItem> updateStatusAndComment(
            @PathVariable Long id,
            @RequestBody OrderItemDTO dto,
            @AuthenticationPrincipal User user) throws FirebaseMessagingException {

        System.out.println("comment id" + dto.getComment());
        // Use dto.getStatus() and dto.getComment() here
        OrderItem savedOrder = orderItemService.updateStatusAndComment(id, dto, user);

        return new ResponseEntity<>(savedOrder, HttpStatus.OK);
    }

    @PatchMapping("/add-images/{id}")
    public ResponseEntity<OrderItem> addNewImages(
            @PathVariable Long id,
            @RequestPart(value = "images", required = true) MultipartFile[] files, // Change this from @RequestParam to @RequestBody
            @AuthenticationPrincipal User user) {


        // Use dto.getStatus() and dto.getComment() here
        OrderItem savedOrder = orderItemService.addNewImages(id, user, files);

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
