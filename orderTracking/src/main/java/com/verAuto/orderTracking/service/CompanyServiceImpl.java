package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CompanyDAO;
import com.verAuto.orderTracking.entity.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService{
    private CompanyDAO companyDAO;

    @Autowired
    public CompanyServiceImpl(CompanyDAO companyDAO) {
        this.companyDAO = companyDAO;
    }

    @Override
    public List<Company> findAll() {
        return companyDAO.findAll();
    }

    @Override
    public Company findById(Long id) {
        return companyDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Did not find company id - " + id));
    }

    @Override
    public Company save(Company company) {
        return companyDAO.save(company);
    }

    @Override
    public void deleteById(Long id) {
        boolean exists = companyDAO.existsById(id);
        if(!exists) {
            throw new RuntimeException("company with ID " + id + " does not exist");
        }
        companyDAO.deleteById(id);
    }
}
