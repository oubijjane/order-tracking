package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.CarModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarModelDAO extends JpaRepository<CarModel, Long> {
    List<CarModel> findByCarBrandId(Long brandId);
}
