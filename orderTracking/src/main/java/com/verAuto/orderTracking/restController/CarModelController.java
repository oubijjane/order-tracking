package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.entity.CarModel;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.service.CarModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/models")
public class CarModelController {
    private CarModelService carModelService;

    @Autowired
    public CarModelController(CarModelService carModelService){
        this.carModelService = carModelService;
    }

    @GetMapping
    public ResponseEntity<List<CarModel>>  getAllModels() {
        return new ResponseEntity<>(carModelService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/brand/{id}")
    public ResponseEntity<List<CarModel>>  getModelsByBrand(@PathVariable Long id) {
        return new ResponseEntity<>(carModelService.findByCarBrandId(id), HttpStatus.OK);
    }
}
