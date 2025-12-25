package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CompanyDAO;
import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService{
    private CompanyDAO companyDAO;

    @Autowired
    public CompanyServiceImpl(CompanyDAO companyDAO) {
        this.companyDAO = companyDAO;
    }

    @Override
    public List<Company> findAll(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getRole().getName().toUpperCase())
                .collect(Collectors.toSet());

        // Rule 1: Garagiste (City-based)
        if (roleNames.contains("ROLE_GESTIONNAIRE")) {
            return companyDAO.findAllByUserId(user.getId());
        }
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
