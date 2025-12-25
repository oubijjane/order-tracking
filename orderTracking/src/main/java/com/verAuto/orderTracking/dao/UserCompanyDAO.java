package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.UserCompany;
import com.verAuto.orderTracking.entity.UserCompanyId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCompanyDAO extends JpaRepository<UserCompany, UserCompanyId> {
    List<UserCompany> findByUserId(int usedId);
    List<UserCompany> findByCompanyId(Long companyId);
}
