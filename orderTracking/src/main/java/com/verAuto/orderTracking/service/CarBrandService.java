package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.BrandDTO;
import com.verAuto.orderTracking.entity.CarBrand;
import com.verAuto.orderTracking.entity.CarModel;

import java.util.List;

public interface CarBrandService {
    List<CarBrand> findAll();
    CarBrand findById(Long id);
    CarBrand saveNewBrand(BrandDTO brandDTO);
    CarBrand updateBrand(long id,BrandDTO brandDTO);
    void deleteById(Long id);
}
