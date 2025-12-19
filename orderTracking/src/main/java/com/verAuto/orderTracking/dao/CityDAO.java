package com.verAuto.orderTracking.dao;

import com.verAuto.orderTracking.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityDAO extends JpaRepository<City, Long> {

}
