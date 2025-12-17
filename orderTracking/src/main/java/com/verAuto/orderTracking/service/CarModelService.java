package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.entity.CarModel;

import java.util.List;

public interface CarModelService {
    List<CarModel> findAll();
    CarModel findById(Long id);
    List<CarModel> findByCarBrandId(Long brandId);
    CarModel save(CarModel CarModel);
    void deleteById(Long id);
}
