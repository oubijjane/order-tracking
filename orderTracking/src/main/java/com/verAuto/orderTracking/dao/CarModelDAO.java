package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.CarModel;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarModelDAO extends JpaRepository<CarModel, Long> {
    List<CarModel> findByCarBrandId(Long brandId);
    Page<CarModel> findAll(Pageable pageable);
    Boolean existsByModel(String model);
}
