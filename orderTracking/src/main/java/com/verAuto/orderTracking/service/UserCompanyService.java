package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CreateUserCompany;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserCompany;
import com.verAuto.orderTracking.entity.UserCompanyId;

import java.util.List;

public interface UserCompanyService {
    List<UserCompany> findAll();
    UserCompany saveNewUserCompany(CreateUserCompany userCompany);
    List<UserCompany> findCompanyByUserId(int userId);
    void deleteByUserId(int id);
    void deleteUserCompany(UserCompanyId id);
}
