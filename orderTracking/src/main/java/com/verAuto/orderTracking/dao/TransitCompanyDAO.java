package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.TransitCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransitCompanyDAO extends JpaRepository<TransitCompany, Long> {
    boolean existsByName(String name);
}
