package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.entity.Company;
import com.verAuto.orderTracking.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public ResponseEntity<List<Company>> findAllCompanies() {
        List<Company> companies = companyService.findAll();

        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> findCompaniesById(@PathVariable Long id) {
        Company company = companyService.findById(id);

        return new ResponseEntity<>(company, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        company.setId(null);
        Company addedCompany = companyService.save(company);
        return new ResponseEntity<>(addedCompany, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company company){
        Company updatedCompany = companyService.findById(id);

        updatedCompany.setCompanyName(company.getCompanyName());
        Company savedCompany = companyService.save(updatedCompany);

        return new ResponseEntity<>(savedCompany, HttpStatus.OK);
    }

    @DeleteMapping
    @RequestMapping("/{id}")
    public ResponseEntity<String> deleteCompanyById(@PathVariable Long id){
         companyService.deleteById(id);

         return new ResponseEntity<>("The company id " + id + " has successfully deleted", HttpStatus.NO_CONTENT);
    }
}
