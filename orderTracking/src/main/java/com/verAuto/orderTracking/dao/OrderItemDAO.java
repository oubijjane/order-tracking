package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemDAO extends JpaRepository<OrderItem, Long>, JpaSpecificationExecutor<OrderItem> {

    List<OrderItem> findByRegistrationNumber(String registrationNumber);
    Page<OrderItem> findOrderItemByUserId(int userId, Pageable pageable);
    Page<OrderItem> findByStatus(OrderStatus status, Pageable pageable);
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o GROUP BY o.status")
    List<Object[]> countOrdersByStatusRaw();
    List<OrderItem> findByCity(City city);
    @Query("SELECT o FROM OrderItem o WHERE o.city = :city OR o.user = :user")
    List<OrderItem> findByCityOrUser(@Param("city") City city, @Param("user") User user);
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o WHERE o.city = :city GROUP BY o.status")
    List<Object[]> countOrdersByStatusAndCity(@Param("city") City city);
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o " +
            "WHERE o.city = :city OR o.user = :user " +
            "GROUP BY o.status")
    List<Object[]> countOrdersByStatusAndCityOrUser(@Param("city") City city, @Param("user") User user);
    @Query("SELECT o FROM OrderItem o WHERE o.company.id IN :companyIds")
    List<OrderItem> findAllByCompanyIds(@Param("companyIds") List<Long> companyIds);
    @Query("SELECT oi FROM OrderItem oi WHERE (oi.status = :status AND oi.city = :city) OR oi.user = :user")
    Page<OrderItem> findByStatusAndCity(@Param("status") OrderStatus status, @Param("city") City city,
                                        @Param("user") User user,Pageable pageable);
    // 1. Count Orders (Dashboard)
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o " +
            "WHERE (o.company.id IN :companyIds OR o.user.id = :userId) " + // <--- Key Change
            "GROUP BY o.status")
    List<Object[]> countOrdersByStatusAndCompanies(
            @Param("companyIds") List<Long> companyIds,
            @Param("userId") Integer userId
    );

    // 2. Filter Orders (List View)
    @Query("SELECT oi FROM OrderItem oi " +
            "WHERE oi.status = :status " +
            "AND (oi.company.id IN :companyIds OR oi.user.id = :userId) " + // <--- Key Change
            "ORDER BY oi.createdAt DESC")
    Page<OrderItem> findByStatusAndCompanies(
            @Param("status") OrderStatus status,
            @Param("companyIds") List<Long> companyIds,
            @Param("userId") Integer userId, // <--- New Parameter
            Pageable pageable
    );

    // 3. Report Query (Export)
// Be careful: If Admins use this, they need to pass specific parameters or use a different method.
    @Query("SELECT o FROM OrderItem o " +
            "JOIN FETCH o.company " +
            "JOIN FETCH o.carModel m " +
            "JOIN FETCH o.city " +
            "LEFT JOIN FETCH o.transitCompany " +
            "WHERE (o.company.id IN :companyIds OR o.user.id = :userId) " + // <--- Key Change
            "ORDER BY o.createdAt DESC")
    List<OrderItem> findAllForReport(
            @Param("companyIds") List<Long> companyIds,
            @Param("userId") Integer userId
    );

    // for admins and logistics
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o GROUP BY o.status")
    List<Object[]> countAllOrdersByStatus();

    // Admin sees ALL orders for a status
    @Query("SELECT oi FROM OrderItem oi WHERE oi.status = :status ORDER BY oi.createdAt DESC")
    Page<OrderItem> findAllByStatus(@Param("status") OrderStatus status, Pageable pageable);

    // Admin report (Be careful with data size!)
    @Query("SELECT o FROM OrderItem o JOIN FETCH o.company JOIN FETCH o.carModel m JOIN FETCH o.city LEFT JOIN FETCH o.transitCompany ORDER BY o.createdAt DESC")
    List<OrderItem> findAllForReportAdmin();


}
