package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.CarBrand;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarBrandDAO extends JpaRepository<CarBrand, Long> {
}
