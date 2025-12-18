package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyDAO extends JpaRepository<Company, Long> {

}
