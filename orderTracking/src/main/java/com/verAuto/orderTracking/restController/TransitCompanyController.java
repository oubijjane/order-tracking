package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.TransitCompanyDTO;
import com.verAuto.orderTracking.entity.TransitCompany;
import com.verAuto.orderTracking.service.TransitCompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transit-company")
public class TransitCompanyController {

    private final TransitCompanyService transitCompanyService;

    @Autowired
    public TransitCompanyController(TransitCompanyService transitCompanyService) {
        this.transitCompanyService = transitCompanyService;
    }

    @GetMapping
    public ResponseEntity<List<TransitCompany>> getAllTransitCompany() {
        return new ResponseEntity<>(transitCompanyService.findAllTransitCompany(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<TransitCompany> getAllTransitCompany(@PathVariable long id) {
        return new ResponseEntity<>(transitCompanyService.findTransitCompanyById(id), HttpStatus.OK);
    }
    @PostMapping()
    public ResponseEntity<TransitCompany> createNewTransitCompany(@RequestBody TransitCompanyDTO request) {
        return new ResponseEntity<>(transitCompanyService.saveNewTransitCompany(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransitCompany> updateTransitCompany(@PathVariable long id, @RequestBody TransitCompanyDTO request) {
        return new ResponseEntity<>(transitCompanyService.updateTransitCompany(id, request), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransitCompany(@PathVariable long id) {
        transitCompanyService.deleteTransitCompany(id);
        return new ResponseEntity<>("transit company with the id " + id + "  has been deleted", HttpStatus.OK);
    }
}
