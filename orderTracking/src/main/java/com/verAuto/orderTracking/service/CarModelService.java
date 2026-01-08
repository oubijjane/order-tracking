package com.verAuto.orderTracking.service;

import com.verAuto.orderTracking.DTO.ModelDTO;
import com.verAuto.orderTracking.entity.CarModel;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CarModelService {
    List<CarModel> findAll();
    Page<CarModel> findAllModel(int page, int size);
    CarModel findById(Long id);
    List<CarModel> findByCarBrandId(Long brandId);
    CarModel save(ModelDTO modelDTO);
    CarModel updateCarModel(long id, ModelDTO modelDTO);
    void deleteById(Long id);
}
