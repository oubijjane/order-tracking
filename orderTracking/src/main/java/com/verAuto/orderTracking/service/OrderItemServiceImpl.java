package com.verAuto.orderTracking.service;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.verAuto.orderTracking.DTO.HistoryDTO;
import com.verAuto.orderTracking.DTO.OrderItemDTO;
import com.verAuto.orderTracking.DTO.WindowDetailsDTO;
import com.verAuto.orderTracking.dao.CityDAO;
import com.verAuto.orderTracking.dao.OrderItemDAO;
import com.verAuto.orderTracking.dao.UserDeviceDAO;
import com.verAuto.orderTracking.entity.*;
import com.verAuto.orderTracking.enums.CompanyAssignmentType;
import com.verAuto.orderTracking.enums.OrderStatus;
import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Service
public class OrderItemServiceImpl implements OrderItemService {
    private static final Logger logger = LoggerFactory.getLogger(OrderItemService.class);

    private final EmailService emailService;
    private final WindowDetailsService windowDetailsService;
    private final HistoryService historyService;
    private final OrderItemImagesService orderItemImagesService;
    private final OrderItemDAO orderItemDAO;
    private final CityDAO cityDAO ;
    private final CommentService commentService;
    private final UserRoleServiceImpl userRoleService;
    private final TransitCompanyService transitCompanyService;
    private final NotificationService notificationService;
    private final UserDeviceDAO deviceRepo;

    private static final String MOROCCAN_PLATE_REGEX = "^(?:\\d{5}[A-Za-z\\u0600-\\u06FF]\\d{2}|[A-Za-z]{2}\\d{6})$";
    private static final Pattern PLATE_PATTERN = Pattern.compile(MOROCCAN_PLATE_REGEX);

    @Autowired
    public OrderItemServiceImpl (EmailService emailService, WindowDetailsService windowDetailsService, HistoryService historyService, OrderItemDAO orderItemDAO,
                                 CityDAO cityDAO,
                                 OrderItemImagesService orderItemImagesService, CommentService commentService, UserRoleServiceImpl userRoleService, TransitCompanyService transitCompanyService, NotificationService notificationService, UserDeviceDAO deviceRepo) {
        this.emailService = emailService;
        this.windowDetailsService = windowDetailsService;
        this.historyService = historyService;
        this.orderItemDAO = orderItemDAO;
        this.cityDAO = cityDAO;
        this.orderItemImagesService = orderItemImagesService;
        this.commentService = commentService;
        this.userRoleService = userRoleService;
        this.transitCompanyService = transitCompanyService;
        this.notificationService = notificationService;
        this.deviceRepo = deviceRepo;
    }

    @Override
    public List<OrderItem> findAll(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());

        // 1. Logic for Garagiste
        if (roleNames.contains("ROLE_GARAGISTE")) {
            // Validation: Ensure the user actually has a city assigned
            if (user.getCity() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L' n'est associé à aucune ville.");
            }
            // No need for cityDAO.findById(id) if user.getCity() is already populated.
            // We pass the user and the city directly to the DAutilisateurO.
            return orderItemDAO.findByCityOrUser(user.getCity(), user);
        }

        // 2. Logic for Gestionnaire
        if (roleNames.contains("ROLE_GESTIONNAIRE")) {
            List<Long> companyIds = user.getCompanies().stream()
                    .map(uc -> uc.getCompany().getId())
                    .toList();

            if (companyIds.isEmpty()) return new ArrayList<>();

            return orderItemDAO.findAllByCompanyIds(companyIds);
        }

        // 3. Default (Admin/Logistics)
        return orderItemDAO.findAll();
    }

    @Override
    public List<OrderItem> findAllForReport(User user, String companyName, String cityName,
                                            String registrationNumber, String status) {
        // We use .findAll(Specification) which returns a List<T> instead of a Page<T>
        // We also add a Sort to ensure the Excel file is ordered by ID descending
        return orderItemDAO.findAll(
                createSearchSpecification(user, companyName, cityName, registrationNumber, status),
                Sort.by("id").descending()
        );
    }

    @Override
    public Page<OrderItem> findOrdersDynamic(User user, String companyName, String cityName,
                                             String registrationNumber, String status,
                                             int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return orderItemDAO.findAll(createSearchSpecification(user, companyName, cityName, registrationNumber, status), pageable);
    }

    @Override
    public Page<OrderItem> findOrderItemByUserId(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return orderItemDAO.findOrderItemByUserId(user.getId(), pageable);
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
        Integer userId = user.getId();


        List<Object[]> results;
        if (roleNames.contains("ROLE_GARAGISTE")) {
            results = orderItemDAO.countOrdersByStatusAndCityOrUser(user.getCity(), user);
        } else if (roleNames.contains("ROLE_GESTIONNAIRE")) {

            // 1. Get ONLY Primary Company IDs
            List<Long> primaryIds = user.getPrimaryCompanies().stream()
                    .map(uc -> uc.getCompany().getId())
                    .collect(Collectors.toList());

            // 2. SAFETY: If list is empty, add a "dummy" ID (like -1)
            // This prevents SQL errors while still allowing the "OR user.id" part to work.
            if (primaryIds.isEmpty()) {
                primaryIds.add(-1L);
            }
            results = orderItemDAO.countOrdersByStatusAndCompanies(primaryIds, userId);

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
        Integer userId = user.getId();

        // 1. Get ONLY Primary Company IDs


        // 2. Branch logic for different roles
        if (roleNames.contains("ROLE_GARAGISTE")) {
            return orderItemDAO.findByStatusAndCity(status, user.getCity(), user, pageable);
        }

        if (roleNames.contains("ROLE_GESTIONNAIRE")) {

            List<Long> primaryIds = user.getPrimaryCompanies().stream()
                    .map(uc -> uc.getCompany().getId())
                    .collect(Collectors.toList());

            // 2. SAFETY: If list is empty, add a "dummy" ID (like -1)
            // This prevents SQL errors while still allowing the "OR user.id" part to work.
            if (primaryIds.isEmpty()) {
                primaryIds.add(-1L);
            }
            // Now passing pageable here
            return orderItemDAO.findByStatusAndCompanies(status, primaryIds, userId, pageable);
        }

        // Default case (e.g. ROLE_ADMIN): Now passing pageable here
        return orderItemDAO.findByStatus(status, pageable);
    }

    @Override
    public OrderItem findById(Long id) {

        OrderItem orderItem = orderItemDAO.findById(id) // This already returns Optional<OrderItem>
                .orElseThrow(() -> new RuntimeException("Did not find order number - " + id));
        return orderItem;
    }

    @Override
    public OrderItem addNewImages(Long id, User user, MultipartFile[] files) {
        OrderItem orderItem = findByIdBasedOnRole(id, user);

        if (files != null && files.length > 0) {
            try {
                orderItemImagesService.saveImages(files, orderItem);
            } catch (IOException e) {
                // Throwing a RuntimeException triggers the @Transactional rollback
                throw new RuntimeException("Failed to store images, rolling back order creation", e);
            }
        }
        addHistory(orderItem,user.getUsername(), "Ajout d'une nouvelle image",
                " ",
                " ");
        //notifyOrderCreated(orderItem);
        String title = "Nouvelle image ";
        String body = user.getUsername() + " "
                + orderItem.getWindowType().getLabel() + " " + orderItem.getCarModel().getCarBrand().getBrand() + " "
                + " " + orderItem.getCarModel().getModel()
                + " " + orderItem.getCompany().getCompanyName();
        notifyUsers(orderItem, user, title, body);
        return null;
    }

    @Override
    public OrderItem findByIdBasedOnRole(Long id, User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());
        if(roleNames.contains("ROLE_GESTIONNAIRE")) {
            List<Long> companiesIds = user.getCompanies().stream()
                    .map(company -> company.getCompany().getId())
                            .toList();
           return orderItemDAO.findByIdByCompany(companiesIds, id);
        } if(roleNames.contains("ROLE_GARAGISTE")) {
            Long cityId = user.getCity().getId();
            return orderItemDAO.findByIdByCity(cityId, id);
        }

        System.out.println("test");

        return findById(id);
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

        if (orderItem.getWindowType() == null || orderItem.getCarModel() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le type de vitre et le modèle sont obligatoires.");
        }
        // 1. Associate the user and save the Order first (to get the ID)
        String regNum = orderItem.getRegistrationNumber();
        checkRegFormat(regNum);
        String item = orderItem.getWindowType().toString() + " " + orderItem.getCarModel().getModel();
        doubleOrderCheckByRegNumber(regNum, item);
        String normalizedReg = regNum.trim().toUpperCase();
        orderItem.setRegistrationNumber(normalizedReg);

        orderItem.setUser(user);
        orderItem.setFileNumber("");
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
        // orderItem.setUpdatedAt();
       //3. send emails to the logistic team
        emailService.sendOrderNotification(savedOrder, getLogisticTeamEmails());
        return savedOrder;
    }

    @Override
    public List<OrderItemDTO> findByGroupId(User user, Long orderId) {


        List<Long> companyIds = user.getCompanies().stream()
                .map(uc -> uc.getCompany().getId())
                .toList();
        OrderItem order = findByIdBasedOnRole(orderId, user);
        List<OrderItemDTO> orders = new ArrayList<>();
        if (order != null) {
            orders = orderItemDAO
                    .findGroupOrdersExceptSelf(order.getGroupId(), companyIds, orderId)
                    .stream()
                    .map(orderItem -> {
                        OrderItemDTO orderDetails = new OrderItemDTO();
                        orderDetails.setOrderId(orderItem.getId());

                        String details = orderItem.getCarModel().getCarBrand().getBrand()
                                + " " + orderItem.getCarModel().getModel();

                        orderDetails.setWindowBrand(details);
                        orderDetails.setWindowType(orderItem.getWindowType().getLabel());
                        orderDetails.setOrderStatus(orderItem.getStatus());

                        return orderDetails;
                    })
                    .toList();
        }

        return orders;
    }

    @Override
    public List<OrderItem> saveOrderWithMultiParts(List<OrderItem> items, User user, MultipartFile[] files) {
        items.forEach(item -> {
            checkRegFormat(item.getRegistrationNumber());
            String order = item.getWindowType().toString() + " " + item.getCarModel().getModel();
            doubleOrderCheckByRegNumber(item.getRegistrationNumber(), order);
        } );
        String groupId = UUID.randomUUID().toString();


        return items.stream().map( orderItem -> {
            String normalizedReg = orderItem.getRegistrationNumber().trim().toUpperCase();
            orderItem.setRegistrationNumber(normalizedReg);
            orderItem.setUser(user);
            orderItem.setFileNumber("");
            orderItem.setGroupId(groupId);
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
            // orderItem.setUpdatedAt();
            //3. send emails to the logistic team
            emailService.sendOrderNotification(savedOrder, getLogisticTeamEmails());
            return savedOrder;
        }).toList();
    }

    @Override
    @Transactional
    public OrderItem updateStatusAndComment(Long id, OrderItemDTO newStatus, User user) throws FirebaseMessagingException {
        // 1. Normalize user roles
        assert user.getRoles() != null;
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());

        // 2. Fetch the existing order
        OrderItem existingOrder = findById(id);
        String action;
        OrderStatus currentStatus = existingOrder.getStatus();
        String userName = user.getUsername();
        // check if the order is repaired before adding a file number
        boolean isProvidingFileNumber = newStatus.getFileNumber() != null && !newStatus.getFileNumber().trim().isEmpty();
        if (isProvidingFileNumber && !existingOrder.getStatus().equals(OrderStatus.REPAIRED)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le numéro de dossier ne peut être renseigné que pour les commandes au statut 'RÉPARÉ'.");
        }

        // 3. If everything is fine, set it
        if (isProvidingFileNumber) {
            action = "Changement du numéro de dossier vers";
            addHistory(existingOrder,userName, action,
                    existingOrder.getFileNumber(),
                    newStatus.getFileNumber().trim());
            existingOrder.setFileNumber(newStatus.getFileNumber().trim());
        }
        if(newStatus.getAdditionalComment() != null && !existingOrder.getStatus().equals(OrderStatus.CANCELLED)) {
            action = "Ajout d’un commentaire";
            String commentLabel = newStatus.getAdditionalComment();
            addHistory(existingOrder,userName, action,
                    existingOrder.getComment(),
                    commentLabel);

            existingOrder.setComment(commentLabel);
        }
        // 3. Status and Role Logic
        if (newStatus.getOrderStatus() != null) {
            validateStatusTransition(currentStatus, newStatus.getOrderStatus());
            action = "Changement du statut de la commande vers";
            checkRolePermissions(roleNames, newStatus.getOrderStatus());
            addHistory(existingOrder,userName, action,
                    existingOrder.getStatus().getLabel(),
                    newStatus.getOrderStatus().getLabel());
            addOffersToOrder(newStatus.getWindowDetailsList(), newStatus.getOrderStatus());
            selectOffer(id, newStatus.getSelectedWindowDetail(), newStatus.getOrderStatus());

            if (newStatus.getOrderStatus() == OrderStatus.SENT) {
                // 1. Validate Transit Company

                if (newStatus.getCityId() == null || newStatus.getCityId() <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "la ville est obligatoire");
                }




                // 3. Process the update
                City city = cityDAO.findById(newStatus.getCityId())
                        .orElseThrow(()->
                                new RuntimeException("could not find a city with the id: " + newStatus.getCityId()));

                existingOrder.setCity(city);
            }
            // --- RULE: Transit Company Logic ---
            if (newStatus.getOrderStatus() == OrderStatus.IN_TRANSIT) {
                // 1. Validate Transit Company
                if (newStatus.getTransitCompanyId() == null || newStatus.getTransitCompanyId() <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Une société de transit est obligatoire pour le passage en transit.");
                }

                // 2. Validate Declaration Number (Fixed the logic here)

                // 3. Process the update
                TransitCompany company = transitCompanyService.findTransitCompanyById(newStatus.getTransitCompanyId());

                existingOrder.setTransitCompany(company);
                existingOrder.setDeclarationNumber(newStatus.getDeclarationNumber().trim());
            }

            existingOrder.setStatus(newStatus.getOrderStatus());
        }
        // 4. Comment Logic
        if(newStatus.getOrderStatus() != null && newStatus.getOrderStatus().equals(OrderStatus.CANCELLED) && newStatus.getComment() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "commentaire obligatoire");
        }
        if (newStatus.getComment() != null) {
            // Use CommentService to get the label
            action = "Ajout d’un commentaire";
            String commentLabel = commentService.findCommentById(newStatus.getComment()).getLabel();
            addHistory(existingOrder,userName, action,
                    existingOrder.getComment(),
                    commentLabel);

            existingOrder.setComment(commentLabel);
        } else
        if(newStatus.getPhoneNumber() != null) {
            action = "Ajout numero de telephone";
            String phoneNumber = newStatus.getPhoneNumber();
            addHistory(existingOrder, userName, action, "", phoneNumber);

            existingOrder.setPhoneNumber(phoneNumber);
        }
        // 5. Finalize
       // existingOrder.setUpdatedAt();
        return orderItemDAO.save(existingOrder);
    }

    @Transactional
    @Override
    public void deleteById(Long id) {
        boolean exists = orderItemDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("Order with ID " + id + " does not exist");
        }
        orderItemImagesService.deleteByOrderItemId(id);
        historyService.deleteHistoryByOrderId(id);
        windowDetailsService.deleteByOrderId(id);
        orderItemDAO.deleteById(id);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        boolean isValid = switch (current) {
            case PENDING -> next == OrderStatus.IN_PROGRESS;
            case IN_PROGRESS -> next == OrderStatus.AVAILABLE || next == OrderStatus.NOT_AVAILABLE;
            case AVAILABLE -> next == OrderStatus.SENT || next == OrderStatus.CANCELLED;
            case NOT_AVAILABLE -> next == OrderStatus.AVAILABLE || next == OrderStatus.CANCELLED;
            case SENT -> next == OrderStatus.IN_TRANSIT;
            case IN_TRANSIT -> next == OrderStatus.RECEIVED;
            case RECEIVED -> next == OrderStatus.REPAIRED || next == OrderStatus.RETURN;
            default -> false;
        };

        if (!isValid) {
            throw new RuntimeException("Invalid transition: Cannot move order from " + current + " to " + next);
        }
    }

    private List<String> getLogisticTeamEmails() {
        List<String> emails = new ArrayList<>();
        userRoleService.findUsersByRoleName("ROLE_LOGISTICIEN")
                .forEach(receiverUser ->
                    emails.add(receiverUser.getEmail()));


        return emails;
    }
    private void checkRolePermissions(Set<String> roleNames, OrderStatus targetStatus) {
        if (roleNames.contains("ROLE_ADMIN")) return;

        // Garagiste & Gestionnaire Logic
        if (roleNames.contains("ROLE_GARAGISTE") || roleNames.contains("ROLE_GESTIONNAIRE")) {
            List<OrderStatus> forbidden = Arrays.asList(
                    OrderStatus.AVAILABLE, OrderStatus.IN_PROGRESS, OrderStatus.NOT_AVAILABLE
            );
            if (forbidden.contains(targetStatus)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé pour ce changement de statut.");
            }
        }

        // Specific Gestionnaire Logic
        if (roleNames.contains("ROLE_GESTIONNAIRE") && targetStatus == OrderStatus.RETURN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Le gestionnaire ne peut pas initier de retour.");
        }

        // Logisticien Logic
        if (roleNames.contains("ROLE_LOGISTICIEN")) {
            if (targetStatus == OrderStatus.SENT || targetStatus == OrderStatus.CANCELLED) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Le logisticien ne peut pas envoyer ou annuler.");
            }
        }
    }
    private Specification<OrderItem> createSearchSpecification(User user, String companyName, String cityName,
                                                               String registrationNumber, String status) {
        return (root, query, cb) -> {
            // --- 1. PERFORMANCE: Fetch Joins (Only for Data Query) ---
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("company", JoinType.LEFT);
                root.fetch("city", JoinType.LEFT);
                Fetch<Object, Object> carModelFetch = root.fetch("carModel", JoinType.LEFT);
                carModelFetch.fetch("carBrand", JoinType.LEFT);
                // Ensure you also fetch transitCompany if you use it in the report
                root.fetch("transitCompany", JoinType.LEFT);
            }

            List<Predicate> predicates = new ArrayList<>();

            // --- 2. SECURITY BOUNDARIES (Same as before) ---
            Set<String> roleNames = user.getRoles().stream()
                    .map(r -> r.getRole().getName().toUpperCase())
                    .collect(Collectors.toSet());

            if (roleNames.contains("ROLE_GARAGISTE")) {
                // This creates: (order.city = user.city OR order.user = user)
                Predicate sameCity = cb.equal(root.get("city"), user.getCity());
                Predicate sameUser = cb.equal(root.get("user"), user); // Assumes 'user' field exists in OrderItem

                predicates.add(cb.or(sameCity, sameUser));
            }
            else if (roleNames.contains("ROLE_GESTIONNAIRE")) {
                // 1. Filter to get ONLY Primary Company IDs
                List<Long> primaryCompanyIds = user.getCompanies().stream()
                        .filter(uc -> uc.getType() == CompanyAssignmentType.PRIMARY) // <--- CRITICAL CHANGE
                        .map(uc -> uc.getCompany().getId())
                        .toList();

                // 2. Condition A: "Created by him"
                // This covers orders created by the user for ANY company (Primary or Auxiliary)
                Predicate isMyOrder = cb.equal(root.get("user"), user);

                if (!primaryCompanyIds.isEmpty()) {
                    // 3. Condition B: "Orders of its primary companies"
                    // This covers orders created by ANYONE for the user's Primary companies
                    Predicate isPrimaryCompanyOrder = root.get("company").get("id").in(primaryCompanyIds);

                    // 4. Combine with OR
                    predicates.add(cb.or(isMyOrder, isPrimaryCompanyOrder));
                } else {
                    // Fallback: If no primary companies, they only see their own creations
                    predicates.add(isMyOrder);
                }
            }

            // --- 3. DYNAMIC SEARCH FILTERS ---
            if (StringUtils.hasText(companyName)) {
                Join<OrderItem, Company> companyJoin = root.join("company", JoinType.LEFT);
                predicates.add(cb.like(cb.lower(companyJoin.get("companyName")), "%" + companyName.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(cityName)) {
                Join<OrderItem, City> cityJoin = root.join("city", JoinType.LEFT);
                predicates.add(cb.like(cb.lower(cityJoin.get("cityName")), "%" + cityName.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(registrationNumber)) {
                // Wrapping with % on both sides enables the "contains" logic
                String searchPattern = "%" + registrationNumber.toLowerCase() + "%";

                predicates.add(cb.like(
                        cb.lower(root.get("registrationNumber")),
                        searchPattern
                ));
            }
            if (StringUtils.hasText(status)) {
                try {
                    predicates.add(cb.equal(root.get("status"), OrderStatus.valueOf(status.toUpperCase())));
                } catch (IllegalArgumentException ignored) {}
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    private void addHistory(OrderItem order, String userName, String action, String oldValue, String newValue) {

        HistoryDTO historyDTO = new HistoryDTO();
        historyDTO.setChangedBy(userName);
        historyDTO.setAction(action);
        historyDTO.setOldValue(oldValue);
        historyDTO.setNewValue(newValue);
        historyDTO.setOrder(order);

        historyService.addNewHistory(historyDTO);

    }

    private void addOffersToOrder(List<WindowDetailsDTO> windowDetailsDTOList, OrderStatus newStatus) {

        // 1. Check if we are entering the 'AVAILABLE' phase
        if (OrderStatus.AVAILABLE.equals(newStatus)) {

            // Validation: If we ARE becoming available, we MUST have offers
            if (windowDetailsDTOList == null || windowDetailsDTOList.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La liste des offres est obligatoire pour passer à l'état AVAILABLE.");
            }

            // Integrity: Ensure they all belong to the same order
            Long firstOrderId = windowDetailsDTOList.get(0).getOrderId();
            boolean allMatch = windowDetailsDTOList.stream()
                    .allMatch(dto -> dto.getOrderId() != null && dto.getOrderId().equals(firstOrderId));

            if (!allMatch) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Toutes les offres doivent appartenir à la même commande.");
            }

            // Save and return the saved list
            windowDetailsService.saveWindowsDetails(windowDetailsDTOList);
        }

        // 2. If the status is NOT 'AVAILABLE', we skip the saving logic entirely
        // We return an empty list (or null) because no windows were processed in this step
    }
    private void selectOffer(Long orderId, Long selectedWindowId, OrderStatus newStatus) {

        // 1. Check if we are entering the 'AVAILABLE' phase
        if (OrderStatus.SENT.equals(newStatus)) {

            // Validation: If we ARE becoming available, we MUST have offers
            if (orderId == null ||selectedWindowId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        " L'ID de la vitre sélectionnée est obligatoire pour confirmer l'envoi.");
            }
            WindowDetails window = windowDetailsService.findById(selectedWindowId);

            if (window == null || !window.getOrder().getId().equals(orderId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Sécurité : L'offre sélectionnée n'appartient pas à cette commande.");
            }
            // Integrity: Ensure they all belong to the same order
            WindowDetailsDTO dto = new WindowDetailsDTO();

            dto.setId(selectedWindowId);
            dto.setOrderId(orderId);

            // Save and return the saved list
            windowDetailsService.deleteWindowDetails(dto);
        }
    }

    private void checkRegFormat(String regNum) {
        String cleanedReg = (regNum != null) ? regNum.trim() : null;
        if (regNum == null || !PLATE_PATTERN.matcher(regNum).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Format du matricule invalide. Formats acceptés: 12345A67, WW123456, FA123456.");
        }
    }

    private void doubleOrderCheckByRegNumber(String regNum, String item1) {
        String cleanedReg = (regNum != null) ? regNum.trim() : null;
        OrderItem orderItem;
        List<OrderItem> orderItems = orderItemDAO.findByRegistrationNumber(cleanedReg);
        for (OrderItem item : orderItems) {
            OrderStatus status = item.getStatus();
            String order = item.getWindowType().toString() + " " + item.getCarModel().getModel();

            // If the order is NOT in a 'Terminal' state, block the new order
            if (!(status == OrderStatus.RETURN ||
                    status == OrderStatus.REPAIRED ||
                    status == OrderStatus.CANCELLED) && order.equalsIgnoreCase(item1)) {

                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Une commande active existe déjà pour le matricule n° " + cleanedReg +
                                " (Statut: " + status.getLabel() + "). " +
                                "Pour créer une nouvelle commande, merci d'annuler la commande précédente.");
            }
        }
    }
    /*private void notifyOrderCreated(OrderItem order) {
        try {
            // Get all admin devices
            // Assuming this returns a list of devices for User 52
            List<UserDevice> adminDevices = deviceRepo.findByUserId(52L);

            if (adminDevices == null || adminDevices.isEmpty()) {
                logger.warn("No admin devices found for notifications");
                return;
            }

            // CORRECTED: Collect ALL tokens, just removing duplicate strings
            List<String> tokens = adminDevices.stream()
                    .filter(d -> d.getToken() != null && !d.getToken().isEmpty())
                    .map(UserDevice::getToken) // Extract the token string directly
                    .distinct()                // Prevent duplicate tokens if DB has same token twice
                    .collect(Collectors.toList());

            if (tokens.isEmpty()) {
                logger.warn("No valid tokens found for admin devices");
                return;
            }

            // Send notification to all tokens found
            notificationService.sendToMany(tokens,
                    "New Order Created",
                    "Order #" + order.getId() + " has been created");

            logger.info("Notification sent to {} admin devices", tokens.size());

        } catch (Exception e) {
            logger.error("Error sending notification for order: " + order.getId(), e);
        }
    }*/
    private void notifyUsers(OrderItem order, User user, String title, String body) {
        List<Integer> ids = new ArrayList<>();
        try {
            // Get all admin devices
            // Assuming this returns a list of devices for User 52
            List<UserDevice> adminDevices = new ArrayList<>();
            assert user.getRoles() != null;
            if(containsRole(user.getRoles(), 3) || containsRole(user.getRoles(), 1)) {
                ids.add(4);
                adminDevices = deviceRepo.findAllDevicesByRoleIds(ids);
            } else {
                adminDevices = deviceRepo.findByUserName(order.getUser().getUsername());
                ids.add(order.getUser().getId());
            }
            ids.forEach(userId -> System.out.println("this is the ids: " + userId));

            String url = "/orders/" + order.getId();

            if (adminDevices == null || adminDevices.isEmpty()) {
                logger.warn("No admin devices found for notifications");
                return;
            }

            // CORRECTED: Collect ALL tokens, just removing duplicate strings
            List<String> tokens = adminDevices.stream()
                    .filter(d -> d.getToken() != null && !d.getToken().isEmpty())
                    .map(UserDevice::getToken) // Extract the token string directly
                    .distinct()                // Prevent duplicate tokens if DB has same token twice
                    .collect(Collectors.toList());

            if (tokens.isEmpty()) {
                logger.warn("No valid tokens found for admin devices");
                return;
            }

            // Send notification to all tokens found
            notificationService.sendToMany(tokens,
                    title,
                    body,
                    url);

            logger.info("Notification sent to {} admin devices", tokens.size());

        } catch (Exception e) {
            logger.error("Error sending notification for order: " + order.getId(), e);
        }
    }

    private boolean containsRole(Set<UserRole> userRoles, Integer targetRoleId) {
        for (UserRole ur : userRoles) {
            if (ur.getRole().getId().equals(targetRoleId)) {
                return true;
            }
        }
        return false;
    }
}
