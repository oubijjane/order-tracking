package com.verAuto.orderTracking.restController;


import com.verAuto.orderTracking.DTO.BrandDTO;
import com.verAuto.orderTracking.entity.CarBrand;
import com.verAuto.orderTracking.entity.CarModel;
import com.verAuto.orderTracking.service.CarBrandService;
import com.verAuto.orderTracking.service.CarBrandServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class CarBrandController {
    private final CarBrandService carBrandService;

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
    @PostMapping()
    public ResponseEntity<CarBrand> saveNewBrand( @RequestBody BrandDTO brandDTO) {
        return new ResponseEntity<>(carBrandService.saveNewBrand(brandDTO), HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<CarBrand> UpdateBrand(@PathVariable Long id, @RequestBody BrandDTO brandDTO) {
        return new ResponseEntity<>(carBrandService.updateBrand(id, brandDTO), HttpStatus.OK);
    }
}
