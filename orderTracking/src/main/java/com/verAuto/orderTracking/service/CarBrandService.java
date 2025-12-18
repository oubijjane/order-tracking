package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.CarBrand;
import com.verAuto.orderTracking.entity.CarModel;

import java.util.List;

public interface CarBrandService {
    List<CarBrand> findAll();
    CarBrand findById(Long id);
    CarBrand save(CarBrand carBrand);
    void deleteById(Long id);
}
