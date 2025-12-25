package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.City;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemDAO extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByRegistrationNumber(String registrationNumber);
    List<OrderItem> findByStatus(OrderStatus status);
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o GROUP BY o.status")
    List<Object[]> countOrdersByStatusRaw();
    List<OrderItem> findByCity(City city);
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o WHERE o.city = :city GROUP BY o.status")
    List<Object[]> countOrdersByStatusAndCity(@Param("city") City city);
    @Query("SELECT o FROM OrderItem o WHERE o.company.id IN :companyIds")
    List<OrderItem> findAllByCompanyIds(@Param("companyIds") List<Long> companyIds);
    @Query("SELECT oi FROM OrderItem oi WHERE oi.status = :status AND oi.city = :city")
    List<OrderItem> findByStatusAndCity(@Param("status") OrderStatus status, @Param("city") City city);
    @Query("SELECT o.status, COUNT(o) FROM OrderItem o " +
            "WHERE o.company.id IN :companyIds " +
            "GROUP BY o.status")
    List<Object[]> countOrdersByStatusAndCompanies(@Param("companyIds") List<Long> companyIds);
    @Query("SELECT oi FROM OrderItem oi " +
            "WHERE oi.status = :status " +
            "AND oi.company.id IN :companyIds")
    List<OrderItem> findByStatusAndCompanies(
            @Param("status") OrderStatus status,
            @Param("companyIds") List<Long> companyIds
    );


}
