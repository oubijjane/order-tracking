package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.WindowBrandDTO;
import com.verAuto.orderTracking.entity.WindowBrand;
import com.verAuto.orderTracking.service.WindowBrandService;
import com.verAuto.orderTracking.service.WindowServiceImpl;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/window-brands")
public class windowBrandController {

    private final WindowBrandService windowService;

    public windowBrandController(WindowBrandService windowService) {
        this.windowService = windowService;
    }

    @GetMapping
    public ResponseEntity<List<WindowBrandDTO>> getAllWindowBrands() {
        return new ResponseEntity<>(windowService.getAllWindowBrand(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<WindowBrand> addNewBrand(@RequestBody WindowBrandDTO request) {
        return new ResponseEntity<>(windowService.addNewBrand(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WindowBrand> UpdateBrand(
           @PathVariable Long id,  @RequestBody WindowBrandDTO request) {
        return new ResponseEntity<>(windowService.updateWindowBrand(id, request), HttpStatus.CREATED);
    }
}
