package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.dao.CompanyDAO;
import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        String name = company.getCompanyName();
        if (companyDAO.existsByCompanyName(name)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "companie existe déjà");
        }
        return companyDAO.save(company);
    }

    @Override
    public Company updateCompany(Long id, Company company) {
        Company existingCompany = findById(id);
        String newName = company.getCompanyName();

        // ONLY validate if the name has actually changed
        if (!existingCompany.getCompanyName().equals(newName)) {

            // Check if the NEW name is already used by a DIFFERENT company
            if (companyDAO.existsByCompanyName(newName)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce nom de compagnie est déjà utilisé par un autre client.");
            }

            existingCompany.setCompanyName(newName);
        }

        // Update other fields here (e.g., address, phone)
        // existingCompany.setPhone(company.getPhone());

        return companyDAO.save(existingCompany);
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
