package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.ModelDTO;
import com.verAuto.orderTracking.entity.CarModel;
import com.verAuto.orderTracking.entity.OrderItem;
import com.verAuto.orderTracking.service.CarModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/models")
public class CarModelController {
    private final CarModelService carModelService;

    @Autowired
    public CarModelController(CarModelService carModelService){
        this.carModelService = carModelService;
    }

    @GetMapping
    public ResponseEntity<Page<CarModel>>  getAllModels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return new ResponseEntity<>(carModelService.findAllModel(page,size), HttpStatus.OK);
    }

   @GetMapping("/{id}")
   public ResponseEntity<CarModel> getModelById(@PathVariable Long id) {
        return new ResponseEntity<>(carModelService.findById(id), HttpStatus.OK);
   }

    @GetMapping("/brand/{id}")
    public ResponseEntity<List<CarModel>>  getModelsByBrand(@PathVariable Long id) {
        return new ResponseEntity<>(carModelService.findByCarBrandId(id), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<CarModel> saveNewModel (@RequestBody ModelDTO request) {
        return new ResponseEntity<>(carModelService.save(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarModel> updateCardModel(@PathVariable long id, @RequestBody ModelDTO request) {

        return new ResponseEntity<>(carModelService.updateCarModel(id, request), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteModel(@PathVariable long id) {
        carModelService.deleteById(id);
        return new ResponseEntity<>("model with the id delete" , HttpStatus.NO_CONTENT);
    }
}
