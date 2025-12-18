package com.verAuto.orderTracking.restController;


import com.verAuto.orderTracking.entity.CarBrand;
import com.verAuto.orderTracking.entity.CarModel;
import com.verAuto.orderTracking.service.CarBrandService;
import com.verAuto.orderTracking.service.CarBrandServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class CarBrandController {
    private CarBrandService carBrandService;

    @Autowired
    public CarBrandController(CarBrandService carBrandService) {
        this.carBrandService = carBrandService;
    }

    @GetMapping
    public ResponseEntity<List<CarBrand>> getAllBrands() {
        return new ResponseEntity<>(carBrandService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarBrand> getBrandById(@PathVariable Long id) {
        return new ResponseEntity<>(carBrandService.findById(id), HttpStatus.OK);
    }
}
