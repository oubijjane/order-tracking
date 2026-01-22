package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

public interface CompanyService {
    List<Company> findAll(User user);
    Company findById(Long id);
    Company save(Company company);
    Company updateCompany(Long id, Company company);
    void deleteById(Long id);
}
