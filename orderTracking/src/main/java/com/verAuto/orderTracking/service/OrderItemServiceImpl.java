package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.HistoryDTO;
import com.verAuto.orderTracking.DTO.UpdateOrderStatus;
import com.verAuto.orderTracking.dao.CityDAO;
import com.verAuto.orderTracking.dao.OrderItemDAO;
import com.verAuto.orderTracking.entity.*;
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
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class OrderItemServiceImpl implements OrderItemService {
    private static final Logger logger = LoggerFactory.getLogger(OrderItemService.class);

    private final EmailService emailService;
    private final HistoryService historyService;
    private final OrderItemImagesService orderItemImagesService;
    private final OrderItemDAO orderItemDAO;
    private final CityDAO cityDAO ;
    private final CommentService commentService;
    private final UserRoleServiceImpl userRoleService;
    private final TransitCompanyService transitCompanyService;


    @Autowired
    public OrderItemServiceImpl (EmailService emailService, HistoryService historyService, OrderItemDAO orderItemDAO,
                                 CityDAO cityDAO,
                                 OrderItemImagesService orderItemImagesService, CommentService commentService, UserRoleServiceImpl userRoleService, TransitCompanyService transitCompanyService) {
        this.emailService = emailService;
        this.historyService = historyService;
        this.orderItemDAO = orderItemDAO;
        this.cityDAO = cityDAO;
        this.orderItemImagesService = orderItemImagesService;
        this.commentService = commentService;
        this.userRoleService = userRoleService;
        this.transitCompanyService = transitCompanyService;
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
    @Transactional
    public OrderItem updateStatusAndComment(Long id, UpdateOrderStatus newStatus, User user) {
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
        System.out.println("this is a test " + isProvidingFileNumber);
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
        // 3. Status and Role Logic
        if (newStatus.getOrderStatus() != null) {
            validateStatusTransition(currentStatus, newStatus.getOrderStatus());
            action = "Changement du statut de la commande vers";
            addHistory(existingOrder,userName, action,
                    existingOrder.getStatus().getLabel(),
                    newStatus.getOrderStatus().getLabel());
            checkRolePermissions(roleNames, newStatus.getOrderStatus());

            // --- RULE: Transit Company Logic ---
            if (newStatus.getOrderStatus() == OrderStatus.IN_TRANSIT) {
                // 1. Validate Transit Company
                if (newStatus.getTransitCompanyId() == null || newStatus.getTransitCompanyId() <= 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Une société de transit est obligatoire pour le passage en transit.");
                }

                // 2. Validate Declaration Number (Fixed the logic here)
                if (newStatus.getDeclarationNumber() == null || newStatus.getDeclarationNumber().trim().isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Un numéro de déclaration de transit est obligatoire pour le passage en transit.");
                }

                // 3. Process the update
                TransitCompany company = transitCompanyService.findTransitCompanyById(newStatus.getTransitCompanyId());

                existingOrder.setTransitCompany(company);
                existingOrder.setDeclarationNumber(newStatus.getDeclarationNumber().trim());
            }

            existingOrder.setStatus(newStatus.getOrderStatus());
        }
        // 4. Comment Logic

        if (newStatus.getComment() != null) {
            // Use CommentService to get the label
            action = "Ajout d’un commentaire";
            String commentLabel = commentService.findCommentById(newStatus.getComment()).getLabel();
            addHistory(existingOrder,userName, action,
                    existingOrder.getComment(),
                    commentLabel);
            existingOrder.setComment(commentLabel);
        }

        // 5. Finalize
       // existingOrder.setUpdatedAt();
        return orderItemDAO.save(existingOrder);
    }
    @Override
    public void deleteById(Long id) {
        boolean exists = orderItemDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("Order with ID " + id + " does not exist");
        }
        orderItemImagesService.deleteByOrderItemId(id);
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
                predicates.add(cb.equal(root.get("city"), user.getCity()));
            }
            else if (roleNames.contains("ROLE_GESTIONNAIRE")) {
                List<Long> companyIds = user.getCompanies().stream()
                        .map(uc -> uc.getCompany().getId())
                        .toList();
                if (!companyIds.isEmpty()) {
                    predicates.add(root.get("company").get("id").in(companyIds));
                } else {
                    return cb.disjunction();
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
                predicates.add(cb.like(cb.lower(root.get("registrationNumber")), registrationNumber.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(status)) {
                try {
                    predicates.add(cb.equal(root.get("status"), OrderStatus.valueOf(status.toUpperCase())));
                } catch (IllegalArgumentException ignored) {}
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    private History addHistory(OrderItem order, String userName,String action, String oldValue, String newValue) {

        HistoryDTO historyDTO = new HistoryDTO();
        historyDTO.setChangedBy(userName);
        historyDTO.setAction(action);
        historyDTO.setOldValue(oldValue);
        historyDTO.setNewValue(newValue);
        historyDTO.setOrder(order);

        return historyService.addNewHistory(historyDTO);

    }

}
