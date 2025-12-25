package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyDAO extends JpaRepository<Company, Long> {
    @Query("SELECT uc.company FROM UserCompany uc WHERE uc.id.userId = :userId")
    List<Company> findAllByUserId(@Param("userId") Integer userId);

}
