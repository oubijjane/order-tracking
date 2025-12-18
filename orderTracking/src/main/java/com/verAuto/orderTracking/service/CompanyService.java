package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.Company;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

public interface CompanyService {
    List<Company> findAll();
    Company findById(Long id);
    Company save(Company company);
    void deleteById(Long id);
}
