package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.CarBrand;

import java.util.List;

public interface CarBrandService {
    List<CarBrand> findAll();
    List<CarBrand> findById(Long id);
    CarBrand save(CarBrand carBrand);
    void deleteById(Long id);
}
