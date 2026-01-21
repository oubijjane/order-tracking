package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.CreateUserCompany;
import com.verAuto.orderTracking.dao.CompanyDAO;
import com.verAuto.orderTracking.dao.UserCompanyDAO;
import com.verAuto.orderTracking.dao.UserDAO;
import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.User;
import com.verAuto.orderTracking.entity.UserCompany;
import com.verAuto.orderTracking.entity.UserCompanyId;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserCompanyServiceImpl implements UserCompanyService{
    private final UserCompanyDAO userCompanyDAO;
    private final UserDAO userDAO;
    private final CompanyDAO companyDAO;

    @Autowired
    public UserCompanyServiceImpl(UserCompanyDAO userCompanyDAO, UserDAO userDAO, CompanyDAO companyDAO) {
        this.userCompanyDAO = userCompanyDAO;
        this.userDAO = userDAO;
        this.companyDAO = companyDAO;
    }

    @Override
    public List<UserCompany> findAll() {

        return userCompanyDAO.findAll();
    }

    @Override
    @Transactional
    public UserCompany saveNewUserCompany(CreateUserCompany userCompany) {
        User user = userDAO.findById(userCompany.getUserId())
                .orElseThrow(() -> new RuntimeException("could not find user with the id - " + userCompany.getUserId()));

        Company company = companyDAO.findById(userCompany.getCompanyId())
                .orElseThrow(() -> new RuntimeException("could not find company with the id - " + userCompany.getCompanyId()));
        UserCompany savedUserCompany = new UserCompany();
        savedUserCompany.setCompany(company);
        savedUserCompany.setUser(user);
        savedUserCompany.setId(new UserCompanyId(userCompany.getUserId(), userCompany.getCompanyId()));
        savedUserCompany.setType(userCompany.getType());
        return userCompanyDAO.save(savedUserCompany);
    }

    @Override
    public List<UserCompany> findCompanyByUserId(int userId) {
        return userCompanyDAO.findByUserId(userId);
    }

    @Override
    public void deleteByUserId(int id) {
        userCompanyDAO.deleteByUserId(id);
    }

    @Override
    public void deleteUserCompany(UserCompanyId id) {

    }
}
